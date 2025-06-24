import { defineConfig, devices } from "@playwright/test";

import { configHelper } from "@helpers/config/config.helper";
import { magicStrings, timeouts } from "@constants/index";
import { specSelectorHelper } from "@helpers/spec-selector/spec-selector.helper";
import { envHelper } from "@helpers/env/env.helper";

export default defineConfig({
  globalTimeout: timeouts.testRun,
  timeout: timeouts.test,
  testMatch: specSelectorHelper.get(),
  forbidOnly: envHelper.isCI(),
  retries: configHelper.getTestRetry(),
  fullyParallel: configHelper.isParallelRun() || undefined,
  workers: configHelper.getWorkers(),
  outputDir: `${magicStrings.path.artifacts}/test-results`,
  use: {
    browserName: "chromium",
    baseURL: envHelper.getBaseWebUrl(),
    trace: "retain-on-failure",
    // TODO: turn on when fixed: https://github.com/microsoft/playwright/issues/14813
    // video: "retain-on-failure",
    // TODO: turn off when fixed: https://linear.app/mento-labs/issue/AUT-15/
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
  reporter: configHelper.getReportersList(),
});
