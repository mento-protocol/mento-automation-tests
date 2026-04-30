# Tools and scripts

## `package.json` scripts

See [Running tests](running-tests.md) for the main test commands. Additional maintenance entries:

| Script        | Implementation                                                                         |
| ------------- | -------------------------------------------------------------------------------------- |
| `postinstall` | `tsx src/tools/default-env-vars.tool.ts` — create `.env` if missing                    |
| `prepare`     | `husky install`                                                                        |
| `lint:staged` | Runs **lint-staged** (configured in `package.json` to `eslint --fix` on staged `*.ts`) |

## `src/tools/`

| File                                 | Purpose                                                                                                                                                       |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `default-env-vars.tool.ts`           | Writes default `.env` from `defaultEnvVariables` constant if file absent                                                                                      |
| `verify-env-config.tool.ts`          | Exits non-zero if required wallet / app / chain flags missing                                                                                                 |
| `prepare-fork-data.tool.ts`          | Fork bootstrap: prices + balances via `forkHelper`                                                                                                            |
| `calculate-swap-tests-costs.tool.ts` | CLI (`yargs-parser`) to estimate **CELO / stable** needs for swap suites using **ethers** + **`@mento-protocol/mento-sdk`**; supports `--chain` / `--chainId` |

## Husky

`.husky/pre-commit` runs **pretty-quick** on staged files and **`pnpm run verify:code`**.

## Cost calculator details

`calculate-swap-tests-costs` reads trading pairs and suite configuration from repo constants, simulates or queries Mento contracts per chain, and prints a breakdown for **swap-by-token-pairs**, amount-type swaps, slippage scenarios, and a configurable **high-frequency** count (`DAILY_CONFIG` in source). Use it when onboarding new tokens or chains to ensure test wallets remain funded.
