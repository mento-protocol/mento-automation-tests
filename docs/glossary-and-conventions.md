# Glossary and conventions

## Application names (`APP_NAME`)

| Value          | Product                             |
| -------------- | ----------------------------------- |
| `app-mento`    | Mento dApp (swap, wallet, settings) |
| `governance`   | Mento Governance UI + API           |
| `squid-router` | Squid Router integration surface    |

Enum: `src/constants/apps.constants.ts` (`AppName`).

## Chains (`CHAIN_NAME` + `IS_MAINNET`)

- **`CHAIN_NAME`**: e.g. `Celo`, `Monad`.
- **`IS_MAINNET`**: when `false`, `envHelper` maps logical chain to testnets (e.g. Celo → Celo Sepolia) for RPC and chain id.

Fork mode overlays **localhost** RPC from `magicStrings.chain.*.fork`.

## Playwright tags vs grep

- Suite / test metadata may add tags like **`@smoke`** or **`@regression`** (composed in `test.helper`).
- **`SPECS_REGEX`** and PR healthcheck patterns ultimately become Playwright **`grep`** / **`grepInvert`** — they are **regular expressions**, not only literal file names.

## Test naming and files

- Spec files: `*.spec.ts` under `specs/`.
- Prefer **describe + test** structure using `testHelper` for shared setup and skip logic.

## Secrets vs env vars

In GitHub Actions, repository **secrets** are mapped to **process env** names expected by the framework (e.g. `E2E_TEST_SEED_PHRASE` → `SEED_PHRASE`). See [CI and GitHub Actions](ci-github-actions.md).

## TypeScript strictness

The project does **not** yet enable full `strict` mode in `tsconfig.json`. A future migration should tackle optional fixture typing, `WebApp` unions, `catch` error typing, and `null` initialization patterns across services. See [CONTRIBUTING](../CONTRIBUTING.md).
