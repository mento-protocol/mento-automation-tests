# Troubleshooting

## `verify:env-config` fails immediately

- Confirm **`SEED_PHRASE`**, **`WALLET_PASSWORD`**, **`IS_MAINNET`**, and **`APP_NAME`** are set and non-empty.
- If you only see **`APP=`** in `.env`, add **`APP_NAME=app-mento`** (or the correct app). Runtime code reads **`APP_NAME`**, not `APP`.

## MetaMask or dApp shows the wrong network

- Re-run **`pnpm run build:synpress-cache`** after changing **`IS_MAINNET`**, **`CHAIN_NAME`**, or fork settings.
- For forks, ensure Anvil is listening on **`8545`** and **`IS_FORK=true`**.

## Playwright cannot find specs

- Check **`SPECS_TYPE`** (`web` vs `api`) and **`APP_NAME`** match the directory you expect under `specs/`.
- **`SPECS_REGEX`**: commas become alternation; include **`@tag`** if you filter by tag.

## CI passes locally but fails in GitHub Actions

- Compare **Node** and **Playwright** versions with the workflow container image.
- CI forces **test retries** to **1**; flaky tests may need hardening rather than higher local `TEST_RETRY`.

## Fork / Makefile issues on macOS

- Docker must be running for Otterscan targets.
- **`make stop-all-services`** uses `pkill` on `anvil`; confirm no other Anvil instances hold the port.

## ESLint warnings from `eslint-plugin-playwright`

- **`playwright/no-force-option`**: prefer fixing underlying actionability; suppress only with a narrow inline comment if intentional.
- **`playwright/no-page-pause`**: remove `page.pause()` before merge.

## Report upload failures

- Verify **`E2E_TEST_GCP_SA_KEY`** (JSON) is valid and the bucket policy allows the CI service account to write **`mento-playwright-reports`**.
