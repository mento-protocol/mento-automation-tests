import { magicStrings } from "@constants/magic-strings.constants";
import { loggerHelper } from "@helpers/logger/logger.helper";
import { processEnv } from "@helpers/processEnv/processEnv.helper";

const { SPECS_REGEX, EXCLUDE_SPECS_REGEX, SPECS_TYPE, SPECS_DIR } = processEnv;
const log = loggerHelper.get("SpecSelectorHelper");

class SpecSelectorHelper {
  getSpecsRegex(): RegExp {
    if (!SPECS_REGEX.length) return new RegExp(".*");
    const specNames = new RegExp(SPECS_REGEX.split(",").join("|"));
    SPECS_REGEX.includes("@")
      ? log.trace(`Using the '${specNames}' spec tags to filter specs`)
      : log.trace(`Using the '${specNames}' spec names to filter specs`);
    return specNames;
  }

  getExcludedSpecsRegex(): RegExp | undefined {
    if (!EXCLUDE_SPECS_REGEX?.length) return undefined;
    return new RegExp(EXCLUDE_SPECS_REGEX.split(",").join("|"));
  }

  getSpecsDir(): string {
    const rootDir = this.getSpecsRootDir();
    const specificDir = SPECS_DIR?.length ? `/${SPECS_DIR}` : "";
    SPECS_DIR?.length
      ? log.trace(`Using the '${SPECS_DIR}' specs dir to filter specs`)
      : log.trace(`Using the '${SPECS_TYPE}' root specs dir to filter specs`);
    return `${rootDir}${specificDir}`;
  }

  private getSpecsRootDir(): string {
    switch (SPECS_TYPE) {
      case "web":
        return magicStrings.path.webSpecs;
      case "api":
        return magicStrings.path.apiSpecs;
      default:
        throw new Error(`Please specify SPECS_TYPE using web or api options`);
    }
  }
}

export const specSelectorHelper = new SpecSelectorHelper();

export interface IGetFilteredNamesArgs {
  desiredSpecNames: string[];
  allSpecNames: string[];
}
