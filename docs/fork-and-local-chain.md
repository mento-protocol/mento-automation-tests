# Fork and local chain

Fork mode lets you run the same specs against **Anvil** at `http://localhost:8545` instead of public RPCs, with deterministic state and no real spend.

## Flags and env

- Set **`IS_FORK=true`** in `.env`.
- Use **`IS_MAINNET`** together with fork helpers to choose **mainnet vs testnet** fork profiles (see `magicStrings.chain.*.fork`).
- **`SEED_PHRASE`** (and wallet password) must still be valid for the forked state.

## Makefile targets

| Target                                              | Behavior                                                                                                                                   |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `make mainnet-fork-setup`                           | Start Anvil (mainnet fork) in background, wait, optionally start **Otterscan** (Docker) unless `CI=true`, run `pnpm run fork:prepare-data` |
| `make testnet-fork-setup`                           | Same for testnet fork URL                                                                                                                  |
| `make mainnet-fork-only` / `make testnet-fork-only` | Anvil only, foreground                                                                                                                     |
| `make block-explorer-only`                          | Otterscan only                                                                                                                             |
| `make stop-all-services`                            | Kill `anvil` processes and stop/remove Otterscan container                                                                                 |

The Makefile invokes **`npm run fork:*`** scripts; the repo’s primary package manager is **pnpm**, but those scripts map to the same `package.json` entries.

## `pnpm` scripts related to forks

| Script                                       | Command role                                                               |
| -------------------------------------------- | -------------------------------------------------------------------------- |
| `fork:mainnet`                               | `anvil --fork-url https://forno.celo.org --port 8545`                      |
| `fork:testnet`                               | `anvil --fork-url https://forno.celo-sepolia.celo-testnet.org --port 8545` |
| `fork:prepare-data`                          | Runs `src/tools/prepare-fork-data.tool.ts`                                 |
| `blockexplorer:start` / `blockexplorer:stop` | Docker Otterscan against local RPC                                         |

## Prepare fork data

`src/tools/prepare-fork-data.tool.ts` calls **`forkHelper.reportPrices()`** and **`forkHelper.setInitialBalances()`** (`src/helpers/fork/fork.helper.ts`) so accounts and oracles match what swap and governance tests expect.

## CI fork path

When **`IS_FORK`** is passed into `base-test.yml`, the **install** action can install **make** and **Foundry**, and the **setup** composite action runs the appropriate **`make *-fork-setup`** before **`pnpm run build:synpress-cache`** (with retries).

## Synpress on forks

After the fork is up and env points at `localhost:8545`, rebuild wallet cache:

```bash
pnpm run build:synpress-cache
```

Then run tests as usual (`pnpm run test`).
