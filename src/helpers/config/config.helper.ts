import { ReporterDescription } from "@playwright/test";

import { processEnv } from "@helpers/processEnv/processEnv.helper";
import { magicStrings } from "@constants/magic-strings.constants";
import { envHelper } from "@helpers/env/env.helper";
import { primitiveHelper } from "@helpers/primitive/primitive.helper";

const {
  HTML_REPORT_NAME,
  TESTOMAT_REPORT_GENERATION,
  TESTOMAT_API_KEY,
  IS_PARALLEL_RUN,
} = processEnv;

class ConfigHelper {
  getTestRetry(): number {
    const localRetry = Number(processEnv.TEST_RETRY) || 0;
    return envHelper.isCI() ? 1 : localRetry;
  }

  getWorkers(): number {
    return this.isParallelRun() ? undefined : 1;
  }

  getReportersList(): ReporterDescription[] {
    const htmlReportName = HTML_REPORT_NAME || "playwright-report";
    const commonReporters: ReporterDescription[] = [
      [
        "html",
        {
          outputFolder: `${magicStrings.path.artifacts}/reports/${htmlReportName}`,
        },
      ],
      ["list"],
    ];
    if (!envHelper.isCI() && this.shouldRunTestomatReport()) {
      processEnv.TESTOMATIO_TITLE = `Local at: ${primitiveHelper.getCurrentDateTime()}`;
    }
    if (this.shouldRunTestomatReport()) {
      commonReporters.push([
        "@testomatio/reporter/lib/adapter/playwright.js",
        {
          apiKey: TESTOMAT_API_KEY,
        },
      ]);
    }

    return commonReporters;
  }

  shouldRunTestomatReport(): boolean {
    return primitiveHelper.string.toBoolean(TESTOMAT_REPORT_GENERATION);
  }

  isParallelRun(): boolean {
    return primitiveHelper.string.toBoolean(IS_PARALLEL_RUN);
  }
}

export const configHelper = new ConfigHelper();
