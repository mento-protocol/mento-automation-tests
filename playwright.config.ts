import { defineConfig, devices } from "@playwright/test";

import { configHelper } from "@helpers/config/config.helper";
import { magicStrings, timeouts } from "@constants/index";
import { specSelectorHelper } from "@helpers/spec-selector/spec-selector.helper";
import { envHelper } from "@helpers/env/env.helper";
import { processEnv } from "@helpers/processEnv/processEnv.helper";

export default defineConfig({
  globalTimeout: timeouts.testRun,
  timeout: timeouts.test,
  grep: specSelectorHelper.getSpecsRegex(),
  grepInvert: specSelectorHelper.getExcludedSpecsRegex(),
  testDir: specSelectorHelper.getSpecsDir(),
  forbidOnly: envHelper.isCI(),
  retries: configHelper.getTestRetry(),
  fullyParallel: configHelper.isParallelRun() || undefined,
  workers: configHelper.getWorkers(),
  outputDir: `${magicStrings.path.artifacts}/test-results`,
  use: {
    browserName: "chromium",
    baseURL: envHelper.getBaseWebUrl(),
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        extraHTTPHeaders: {
          "x-vercel-protection-bypass":
            processEnv.VERCEL_AUTOMATION_BYPASS_SECRET,
        },
        ...devices["Desktop Chrome"],
      },
    },
  ],
  reporter: configHelper.getReportersList(),
});
