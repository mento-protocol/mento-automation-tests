import { defineConfig, devices } from "@playwright/test";

import { configHelper } from "@helpers/config/config.helper";
import { envHelper } from "@helpers/env/env.helper";
import { magicStrings } from "@constants/magic-strings.constants";
import { processEnv } from "@helpers/processEnv/processEnv.helper";

export default defineConfig({
  timeout: envHelper.isCI() ? 160_000 : 100_000,
  testDir: configHelper.getTestDirPath(),
  testMatch: configHelper.getSpecs(),
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [
    [
      "html",
      {
        outputFolder: `${magicStrings.path.artifacts}/reports/playwright-report`,
      },
    ],
    ["list"],
  ],
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
});
