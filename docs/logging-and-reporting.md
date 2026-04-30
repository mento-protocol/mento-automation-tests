# Logging and reporting

## Application logging (log4js)

`src/helpers/logger/logger.helper.ts` exposes structured logs used across helpers and tools. **`LOG_LEVEL`** in `.env` controls verbosity (`ALL`, `TRACE`, `INFO`, `DEBUG`, …).

Decorators under `src/decorators/` can attach logging behavior to selected methods.

## Playwright reporters

`src/helpers/config/config.helper.ts` builds the reporter list:

1. **HTML** — always configured; output folder is  
   `artifacts/reports/<HTML_REPORT_NAME>/`  
   Default name: `playwright-report` if `HTML_REPORT_NAME` is unset.
2. **List** — terminal list reporter for CI readability.
3. **Testomat** — appended when **`TESTOMAT_REPORT_GENERATION`** is truthy **and** `TESTOMAT_API_KEY` is available. Locally, a default `TESTOMATIO_TITLE` may be synthesized with a timestamp.

## CI HTML artifacts

`base-test.yml` uploads the HTML report folder with **`actions/upload-artifact`** when generation is `true` or `onFailure` (input `HTML_REPORT_GENERATION`).

## Cloud report (`report.yml`)

On failure (or when configured), the **report** workflow downloads the artifact, authenticates to **Google Cloud** with `GCP_SA_KEY` / `E2E_TEST_GCP_SA_KEY`, and uploads to bucket **`mento-playwright-reports`**. The job output **`url`** is passed into Discord notifications.

## Traces

`playwright.config.ts` sets `use.trace` to **`retain-on-failure`**, so failed tests retain trace zip under the configured `outputDir` (`artifacts/test-results` via `magicStrings`).

## ESLint (Playwright plugin)

`eslint-plugin-playwright` is enabled for recommended rules (e.g. discouraging `page.pause()` in committed code, flagging some `force: true` clicks). Warnings may appear until flows are tightened.
