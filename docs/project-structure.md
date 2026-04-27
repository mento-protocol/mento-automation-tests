# Project structure

## Top-level layout

| Path                   | Purpose                                                                           |
| ---------------------- | --------------------------------------------------------------------------------- |
| `specs/`               | Playwright spec files, grouped by **app** then `web` or `api`                     |
| `src/`                 | Framework code: apps, helpers, fixtures, constants, tools                         |
| `src/wallet-setups/`   | Synpress wallet setup (e.g. `basic.setup.ts`)                                     |
| `artifacts/`           | Test output: reports, screenshots, traces (see `.gitignore`)                      |
| `.github/`             | Actions workflows, reusable workflows, composite actions, Dependabot, PR template |
| `playwright.config.ts` | Playwright entry: timeouts, grep, projects, reporters                             |
| `tsconfig.json`        | TypeScript options and **path aliases**                                           |
| `Makefile`             | Fork + block explorer orchestration for local runs                                |
| `docs/`                | This documentation set                                                            |

## Specs layout

```
specs/
├── app-mento/
│   ├── web/          # UI tests for app.mento.org (and qa/custom)
│   └── api/          # API-focused specs if present
├── governance/
│   ├── web/
│   └── api/
└── squid-router/
    ├── web/
    └── api/
```

Physical paths are mirrored in `magicStrings.path` (`appMento`, `governance`, `squidRouter`) and selected by `APP_NAME` + `SPECS_TYPE` in `spec-selector.helper.ts`.

## `src/` layout (high level)

| Path                     | Purpose                                                                |
| ------------------------ | ---------------------------------------------------------------------- |
| `src/apps/app-mento/`    | Pages and services for Mento swap app                                  |
| `src/apps/governance/`   | Governance UI + API wrappers                                           |
| `src/apps/squid-router/` | Squid Router UI                                                        |
| `src/apps/shared/`       | Shared pages, services, elements, contracts                            |
| `src/helpers/`           | Browser, env, URL, waiter, contract, logger, test runner helpers, etc. |
| `src/fixtures/`          | Playwright fixture extensions (`test.fixture.ts`)                      |
| `src/constants/`         | Apps enum, tokens, timeouts, magic strings, default `.env` template    |
| `src/decorators/`        | Logging decorators                                                     |
| `src/tools/`             | CLI-style scripts invoked from `package.json`                          |

## TypeScript path aliases

Defined in `tsconfig.json` `compilerOptions.paths`:

| Alias              | Maps to                               |
| ------------------ | ------------------------------------- |
| `@shared/*`        | `src/apps/shared/*`                   |
| `@api/*`           | `src/application/api/*`               |
| `@services/*`      | `src/application/web/services/*`      |
| `@page-objects/*`  | `src/application/web/page-objects/*`  |
| `@page-elements/*` | `src/application/web/page-elements/*` |
| `@helpers/*`       | `src/helpers/*`                       |
| `@constants/*`     | `src/constants/*`                     |
| `@fixtures/*`      | `src/fixtures/*`                      |
| `@magic-strings/*` | `src/magic-strings/*`                 |
| `@decorators/*`    | `src/decorators/*`                    |

`playwright.config.ts` imports via these aliases; keep new modules under paths that match existing conventions.

**Note:** Aliases such as `@api/*`, `@services/*`, `@page-objects/*`, and `@page-elements/*` point at `src/application/...` directories that are **not** present in the current tree (reserved or legacy layout). Active code primarily uses `@shared/*`, `@helpers/*`, `@constants/*`, `@fixtures/*`, and `@decorators/*`.
