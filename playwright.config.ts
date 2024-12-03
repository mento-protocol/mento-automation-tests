import { defineConfig, devices } from "@playwright/test";

import { configHelper } from "@helpers/config/config.helper";
import { magicStrings, timeouts } from "@constants/index";
import { processEnv } from "@helpers/processEnv/processEnv.helper";
import { primitiveHelper } from "@helpers/primitive/primitive.helper";

export default defineConfig({
  timeout: timeouts.testRunner,
  // todo: Remove if it handles completely by the getSpecs method
  // testDir: configHelper.getSpecsDir(),
  testMatch: configHelper.getSpecs(),
  forbidOnly: primitiveHelper.string.toBoolean(processEnv.CI),
  retries: configHelper.getTestRetry(),
  fullyParallel: configHelper.isParallelRun() || undefined,
  workers: configHelper.getWorkers(),
  outputDir: `${magicStrings.path.artifacts}/test-results`,
  use: { trace: "on", video: "on" },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  // @ts-ignore
  reporter: configHelper.getReportersList(),
});
