import { processEnv } from "@helpers/processEnv/processEnv.helper";
import { magicStrings } from "@constants/magic-strings.constants";
import { envHelper } from "@helpers/env/env.helper";
import { primitiveHelper } from "@helpers/primitive/primitive.helper";

const { SPEC_NAMES, SPECS_TYPE } = processEnv;

class ConfigHelper {
  getSpecs(): string[] {
    return SPEC_NAMES
      ? SPEC_NAMES.split(",").map(testName =>
          !testName.endsWith(".spec.ts") ? `${testName}.spec.ts` : testName,
        )
      : ["**/*.spec.ts"];
  }

  getTestDirPath(): string {
    switch (SPECS_TYPE) {
      case "web":
        return magicStrings.path.webSpecs;
      case "api":
        return magicStrings.path.apiSpecs;
      case "all":
        return magicStrings.path.allSpecs;
      default:
        throw new Error(`Please specify SPECS_TYPE via: web, api or all`);
    }
  }

  getTestRetry(): number {
    const localRetry = Number(processEnv.TEST_RETRY) || 0;
    return envHelper.isCI() ? 1 : localRetry;
  }

  getReportersList(): unknown {
    const commonReporters: unknown[] = [
      [
        "html",
        {
          outputFolder: `${magicStrings.path.artifacts}/reports/playwright-report`,
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
          apiKey: processEnv.TESTOMAT_API_KEY,
        },
      ]);
    }

    return commonReporters;
  }

  shouldRunTestomatReport(): boolean {
    return primitiveHelper.string.toBoolean(
      processEnv.TESTOMAT_REPORT_GENERATION,
    );
  }
}

export const configHelper = new ConfigHelper();
