# Contributing

Full documentation lives under **[docs/](docs/README.md)** (architecture, env, CI, forks, reporting). This file stays the short GitHub-facing guide.

## PR healthcheck workflow

The [PR Healthcheck](.github/workflows/pr-healthcheck-test.yml) workflow runs on **pull requests** (skips PRs that only change Markdown or `.gitignore`) and on **pushes to `main`**. It reads the **latest commit message** on the checked-out ref (`git log -1`) to decide which app and which tests to run. See [docs/contributing.md](docs/contributing.md) for the same tables with extra context.

### App selection (put one of these in the commit message)

| Tag             | Effect                 |
| --------------- | ---------------------- |
| `@app-mento`    | Run app-mento tests    |
| `@governance`   | Run governance tests   |
| `@squid-router` | Run squid-router tests |

If none match, **app-mento** is used.

### Spec scope (put one of these in the commit message)

| Pattern           | Effect                                    |
| ----------------- | ----------------------------------------- |
| `__@regression__` | Grep for `@regression`                    |
| `__@smoke__`      | Grep for `@smoke`                         |
| `__@full__`       | Run all specs (`.*`)                      |
| `__my-regex__`    | Use `my-regex` as Playwright `grep` value |

If none match, the default is **`connect-wallet`**.

### Combining tags

Include both an app tag and a spec pattern in the same commit message when you need both (for example: `@governance __@smoke__`).

## Code quality

- `pnpm run verify:code` runs TypeScript (`tsc`) and ESLint; it is also run locally via the pre-commit hook.
- **TypeScript `strict` mode** is not enabled yet. Turning it on surfaces a large number of issues (optional fixtures, `null` sentinels on class fields, `WebApp` unions, `catch` typing, and more). A dedicated migration PR should tackle that in stages (for example `strictNullChecks` plus fixture typing, then property initialization and catch blocks).

## Dependency updates

[Dependabot](.github/dependabot.yml) opens weekly update PRs for npm and GitHub Actions. Keep `@playwright/test` and the Playwright Docker image tag in CI workflows aligned when upgrading Playwright.
