import { defineConfig, devices } from "@playwright/test";

import { configHelper } from "@helpers/config/config.helper";
import { magicStrings } from "@constants/magic-strings.constants";
import { timeouts } from "@constants/timeouts.constants";
import { processEnv } from "@helpers/processEnv/processEnv.helper";
import { primitiveHelper } from "@helpers/primitive/primitive.helper";

export default defineConfig({
  timeout: timeouts.testRunner,
  testDir: configHelper.getTestDirPath(),
  testMatch: configHelper.getSpecs(),
  forbidOnly: primitiveHelper.string.toBoolean(processEnv.CI),
  retries: configHelper.getTestRetry(),
  workers: 1,
  outputDir: `${magicStrings.path.artifacts}/test-results`,
  use: {
    trace: "on",
    video: "on",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  // @ts-ignore
  reporter: configHelper.getReportersList(),
});
