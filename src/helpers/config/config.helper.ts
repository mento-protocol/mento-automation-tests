import { processEnv } from "@helpers/processEnv/processEnv.helper";
import { magicStrings } from "@constants/magic-strings.constants";

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
}

export const configHelper = new ConfigHelper();
