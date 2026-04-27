# Environment variables

Variables are read from **`.env`** (via `dotenv` in `src/helpers/processEnv/processEnv.helper.ts`) and typed through `processEnv`. CI workflows set the same names as **job `env`** in `.github/workflows/base-test.yml`.

## Validation before tests

`pnpm run verify:env-config` runs `src/tools/verify-env-config.tool.ts` and **fails** if any of these are missing or empty:

| Variable          | Role                                                      |
| ----------------- | --------------------------------------------------------- |
| `SEED_PHRASE`     | Mnemonic for test wallet                                  |
| `WALLET_PASSWORD` | MetaMask password                                         |
| `IS_MAINNET`      | `true` / `false` — drives mainnet vs testnet chain config |
| `APP_NAME`        | `app-mento` \| `governance` \| `squid-router`             |

**Note:** The auto-generated `.env` template in `src/constants/default-env-variables.constants.ts` historically used a line like `APP=app-mento`. Runtime code expects **`APP_NAME`**. Ensure `.env` contains `APP_NAME=...` or verification and routing will not work.

## Core selection and URLs

| Variable              | Description                                                                           |
| --------------------- | ------------------------------------------------------------------------------------- |
| `ENV`                 | `prod`, `qa`, or effectively `custom` when using a custom base URL                    |
| `CUSTOM_URL`          | When set, selects custom web base URL behavior (see `envHelper.getBaseWebUrl()`)      |
| `CHAIN_NAME`          | e.g. `Celo`, `Monad` — combined with `IS_MAINNET` to resolve RPC, chain id, etc.      |
| `IS_FORK`             | When true, use fork RPC URLs (e.g. `http://localhost:8545`) from `magicStrings.chain` |
| `SPECS_TYPE`          | `web`, `api`, or other values handled by `spec-selector` (default web-like behavior)  |
| `SPECS_REGEX`         | Comma-separated list joined with `\|` for Playwright `grep`                           |
| `EXCLUDE_SPECS_REGEX` | Optional invert grep pattern                                                          |
| `SPECS_DIR`           | Subdirectory under the app’s spec root (e.g. focus a folder)                          |

## Execution tuning

| Variable           | Description                                                                           |
| ------------------ | ------------------------------------------------------------------------------------- |
| `TEST_RETRY`       | Retries per test locally; in CI, retry behavior is forced to **1** in `config.helper` |
| `TEST_RUN_TIMEOUT` | Global test run timeout (wired via `timeouts` constants / config)                     |
| `TEST_TIMEOUT`     | Per-test timeout                                                                      |
| `IS_PARALLEL_RUN`  | Enables parallel mode; optional `WORKERS_COUNT`                                       |
| `LOG_LEVEL`        | log4js level: `ALL`, `TRACE`, `INFO`, `DEBUG`, etc.                                   |

## Governance API (when testing governance API / env)

| Variable                                                    | Description              |
| ----------------------------------------------------------- | ------------------------ |
| `GOVERNANCE_TESTNET_API_KEY` / `GOVERNANCE_TESTNET_API_URL` | QA testnet GraphQL / API |
| `GOVERNANCE_MAINNET_API_KEY` / `GOVERNANCE_MAINNET_API_URL` | Mainnet (when used)      |

`env.helper` chooses keys based on `IS_MAINNET`.

## Reporting

| Variable                     | Description                                               |
| ---------------------------- | --------------------------------------------------------- |
| `TESTOMAT_REPORT_GENERATION` | `true` / `false` — append Testomat reporter               |
| `TESTOMAT_API_KEY`           | Testomat project API key                                  |
| `TESTOMATIO_TITLE`           | Run title (CI may append actor and timestamp)             |
| `HTML_REPORT_NAME`           | Subfolder name under `artifacts/reports/` for HTML output |

## CI-only

| Variable | Description                                                                      |
| -------- | -------------------------------------------------------------------------------- |
| `CI`     | Set by GitHub Actions; used for retries, reporters, fork Makefile branches, etc. |

## Where URLs and chain IDs live

Static **base URLs** per app and environment, **chain metadata**, and **governance** addresses/ABI references live in `src/constants/magic-strings.constants.ts`. Prefer changing that file (or env) rather than hardcoding URLs in specs.
