# CI and GitHub Actions

## Design

- **`base-test.yml`** — reusable **workflow** (`workflow_call`) that installs dependencies, validates code, optionally prepares a fork, runs `pnpm run test`, uploads HTML artifacts, and on failure triggers **report** + **Discord notification**.
- **Composite actions** under `.github/actions/` — **`install`**, **`validate`**, **`setup`** — keep job steps DRY.

The test job runs inside **`mcr.microsoft.com/playwright:v*-jammy`** so browser dependencies match Playwright’s expectations. **`xvfb-run`** wraps the test command for headed MetaMask flows in headless CI.

## Checkout behavior (`base-test.yml`)

The workflow supports:

1. **Same repo** — normal `actions/checkout` when the triggering repository is `mento-automation-tests`.
2. **External caller** — when another repository triggers the workflow, checkout clones **`mento-protocol/mento-automation-tests`** at `main` (or `CHECKOUT_REF`) so `.github/actions/*` paths exist.
3. **Explicit `CHECKOUT_REPOSITORY` / `CHECKOUT_REF`** — for custom cross-repo scenarios.

## Workflows (by file)

| Workflow                                                       | Role                                                                                                                                                                                                                        |
| -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pr-healthcheck-test.yml`                                      | On **pull requests** (skips Markdown-only / `.gitignore`-only diffs) and **push to `main`**: parses **latest commit message** for app + spec regex, then calls `base-test`. Uses **concurrency** to cancel superseded runs. |
| `specific-test.yml`                                            | **Manual** `workflow_dispatch` to run arbitrary app/spec/env/chain inputs via `base-test`.                                                                                                                                  |
| `app-mento-smoke-test.yml`                                     | Callable smoke preset for app-mento (expects `CUSTOM_URL` from caller).                                                                                                                                                     |
| `app-mento-regression-test.yml`                                | Callable regression for app-mento.                                                                                                                                                                                          |
| `governance-smoke-test.yml` / `governance-regression-test.yml` | Callable governance suites.                                                                                                                                                                                                 |
| `squid-router-regression-test.yml`                             | Callable squid-router regression.                                                                                                                                                                                           |
| `report.yml`                                                   | Downloads HTML artifact, uploads to **GCS** (`mento-playwright-reports` bucket), exposes report URL output.                                                                                                                 |
| `notification.yml`                                             | Posts **Discord** webhook on failure with job + report links.                                                                                                                                                               |

Exact triggers (`on:`) for smoke/regression files may be `workflow_call` only — they are intended to be invoked from repo settings, other workflows, or the GitHub UI depending on org setup.

## Secrets (typical)

Referenced from `base-test.yml` and related workflows:

| Secret                                                           | Use                                         |
| ---------------------------------------------------------------- | ------------------------------------------- |
| `E2E_TEST_SEED_PHRASE` / `E2E_TEST_WALLET_PASSWORD`              | Mapped to `SEED_PHRASE` / `WALLET_PASSWORD` |
| `TESTOMAT_API_KEY`                                               | Testomat reporter                           |
| `E2E_TEST_GCP_SA_KEY`                                            | Service account JSON for report upload      |
| `DISCORD_TEST_RUN_WEBHOOK_ID` / `DISCORD_TEST_RUN_WEBHOOK_TOKEN` | Failure notifications                       |
| `GOVERNANCE_TESTNET_API_KEY` / `GOVERNANCE_TESTNET_API_URL`      | Optional governance API tests               |

Fork mode additionally uses Makefile + Foundry in the **install** / **setup** actions when `IS_FORK` is true.

## Dependabot

`.github/dependabot.yml` schedules **weekly** updates for **npm** and **github-actions**, with optional grouping for Playwright and TypeScript-ESLint packages.

## PR healthcheck commit conventions

Documented in [CONTRIBUTING](../CONTRIBUTING.md) and summarized here:

- **App tags in commit message:** `@app-mento`, `@governance`, `@squid-router`
- **Spec scope:** `__@smoke__`, `__@regression__`, `__@full__`, or `__<grep>__` for custom regex
- Default if missing: **app-mento** + **`connect-wallet`**
