# Getting started

## Prerequisites

- **Node.js** ≥ 22.14.0
- **pnpm** (version pinned in `package.json` under `packageManager`)
- **Playwright browsers**: after install, run `pnpm run install:playwright`
- **Foundry** (optional): for fork testing — includes `anvil` ([Foundry book](https://book.getfoundry.sh/getting-started/installation))
- **Docker** (optional): local block explorer (Otterscan) used with some Makefile flows

## Install

```bash
pnpm install
```

`postinstall` runs `src/tools/default-env-vars.tool.ts`, which creates a **`.env`** file from `src/constants/default-env-variables.constants.ts` if one does not exist.

## Required local configuration

1. Set **`SEED_PHRASE`** and **`WALLET_PASSWORD`** for MetaMask / Synpress flows.
2. Set **`IS_MAINNET`** (`true` / `false`) to match the chain you test against. **Rebuild the Synpress cache** when changing this (`pnpm run build:synpress-cache`).
3. Set **`APP_NAME`** to `app-mento`, `governance`, or `squid-router` (must match what `verify-env-config` and the assembler expect — see [Environment variables](environment-variables.md) for the template vs runtime names).

Then:

```bash
pnpm run build:synpress-cache
pnpm run test
```

## Common commands

| Command                      | Use                                                     |
| ---------------------------- | ------------------------------------------------------- |
| `pnpm run test`              | Default Playwright run (runs `verify:env-config` first) |
| `pnpm t`                     | Alias for `pnpm run test`                               |
| `pnpm run test:ui`           | Playwright UI mode                                      |
| `pnpm run test:debug`        | Playwright debug                                        |
| `pnpm run verify:code`       | `tsc` + ESLint                                          |
| `pnpm run verify:env-config` | Validates critical env vars before tests                |

## CI parity

GitHub Actions uses the **Playwright** Docker image version aligned with `@playwright/test` in `package.json` and `base-test.yml`. Keep these in sync when upgrading Playwright.
