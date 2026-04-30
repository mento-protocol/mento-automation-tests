# Running tests

## npm / pnpm scripts

| Script                                   | Behavior                                                                             |
| ---------------------------------------- | ------------------------------------------------------------------------------------ |
| `pnpm run test`                          | `verify:env-config` then `playwright test`                                           |
| `pnpm t`                                 | Same as `pnpm run test`                                                              |
| `pnpm run test:ui`                       | Playwright UI mode                                                                   |
| `pnpm run test:debug`                    | Playwright inspector / debug                                                         |
| `pnpm run install:playwright`            | `playwright install --with-deps`                                                     |
| `pnpm run build:synpress-cache`          | Build Synpress wallet cache from `src/wallet-setups`                                 |
| `pnpm run verify:code`                   | Typecheck + ESLint (used in Husky pre-commit and CI validate step)                   |
| `pnpm run verify:env-config`             | Required env sanity check                                                            |
| `pnpm run linter` / `pnpm run lint`      | ESLint over `*.ts` in the repo                                                       |
| `pnpm run fork:mainnet` / `fork:testnet` | Start Anvil against public RPC (see [Fork and local chain](fork-and-local-chain.md)) |
| `pnpm run calculate:swap-tests-costs`    | Offline tool: estimate balances for swap test matrix (ethers + mento-sdk)            |

## Selecting specs

Playwright config (`playwright.config.ts`) delegates to **`specSelectorHelper`**:

- **`grep`** — from `SPECS_REGEX`: comma-separated tokens become a **regex** (`a,b` → `a|b`). If `SPECS_REGEX` is empty, all specs match (`.*`).
- **`grepInvert`** — optional `EXCLUDE_SPECS_REGEX` with the same comma → `|` rule.
- **`testDir`** — derived from `APP_NAME`, `SPECS_TYPE`, and optional `SPECS_DIR`.

So you can filter by **file name fragment**, **test title** substring, or **`@tag`** if your suite uses Playwright tags (see `test.helper` / `composeTags`).

## Timeouts

`src/constants/timeouts.constants.ts` exposes:

- **`timeouts.test`** — default test timeout (overridable with `TEST_TIMEOUT` ms string)
- **`timeouts.testRun`** — global run cap (`TEST_RUN_TIMEOUT`, default large window)
- Named tiers (`xs`, `m`, `xl`, …) for waits in page objects and helpers

## Parallelism and workers

- **`IS_PARALLEL_RUN`** — when truthy, `configHelper.isParallelRun()` enables `fullyParallel` and allows **`WORKERS_COUNT`** to set worker count; otherwise workers default to **1** for stability in wallet-heavy flows.

## Retries

- Locally: **`TEST_RETRY`** number is used (via `configHelper.getTestRetry()`).
- In CI (`envHelper.isCI()`): retries are forced to **1** regardless of `TEST_RETRY`.

## Headed vs headless

Use Playwright defaults from config plus CLI flags, e.g. `pnpm exec playwright test --headed`.

## Traces and artifacts

Config sets `trace: "retain-on-failure"` and `outputDir` under `artifacts/test-results`. HTML reports go under `artifacts/reports/<HTML_REPORT_NAME>/` when the HTML reporter is enabled.
