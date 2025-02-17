import { defineConfig, devices } from "@playwright/test";

import { configHelper } from "@helpers/config/config.helper";
import { magicStrings, timeouts } from "@constants/index";
import { specSelectorHelper } from "@helpers/spec-selector/spec-selector.helper";
import { envHelper } from "@helpers/env/env.helper";

export default defineConfig({
  timeout: timeouts.testRunner,
  testMatch: specSelectorHelper.get(),
  forbidOnly: envHelper.isCI(),
  retries: configHelper.getTestRetry(),
  fullyParallel: configHelper.isParallelRun() || undefined,
  workers: configHelper.getWorkers(),
  outputDir: `${magicStrings.path.artifacts}/test-results`,
  use: { trace: "on", video: "on", baseURL: envHelper.getBaseWebUrl() },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  // @ts-ignore
  reporter: configHelper.getReportersList(),
});
