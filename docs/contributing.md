# Contributing (extended)

This file expands the root [CONTRIBUTING.md](../CONTRIBUTING.md) with pointers to the rest of the **docs/** tree.

## Before you open a PR

1. Run **`pnpm run verify:code`** (also enforced by Husky on commit).
2. Ensure **`.env`** has valid **`APP_NAME`**, wallet secrets, and **`IS_MAINNET`** for any local runs you rely on (see [Environment variables](environment-variables.md)).
3. If you change Playwright version, align **`@playwright/test`**, **`pnpm`**, and the **Playwright Docker image** tag in CI (see [CI and GitHub Actions](ci-github-actions.md)).

## PR healthcheck (detailed)

Behavior is implemented in [`.github/workflows/pr-healthcheck-test.yml`](../.github/workflows/pr-healthcheck-test.yml). Summary:

- Triggers: **pull requests** (excluding Markdown-only / `.gitignore`-only diffs) and **push to `main`** with the same path filters.
- **Concurrency:** new pushes cancel older runs for the same PR or ref.
- **Commit message** on `HEAD` (`git log -1`) selects app + grep pattern.

### App tags (in latest commit message)

| Tag             | `APP_NAME`              |
| --------------- | ----------------------- |
| `@app-mento`    | `app-mento`             |
| `@governance`   | `governance`            |
| `@squid-router` | `squid-router`          |
| _(none)_        | defaults to `app-mento` |

### Spec patterns (in latest commit message)

| Pattern           | `SPECS_REGEX` / grep |
| ----------------- | -------------------- |
| `__@regression__` | `@regression`        |
| `__@smoke__`      | `@smoke`             |
| `__@full__`       | `.*`                 |
| `__foo__`         | `foo`                |
| _(none)_          | `connect-wallet`     |

Combine app + pattern in one message when needed, e.g. `@governance __@smoke__`.

## Dependency and tooling policy

- [Dependabot](../.github/dependabot.yml): weekly npm + GitHub Actions; review grouped PRs carefully.
- Prefer **small, focused PRs** for test and fixture changes so bisect and revert stay easy.

## TypeScript strict mode

Full **`strict`** compilation is not enabled yet. A staged plan might include: fixture typing (`IExecution` vs `IApplicationFixtures`), `WebApp` narrowing helpers, `catch (e: unknown)` hygiene, and `| null` on intentionally deferred class fields. Track as a dedicated initiative.
