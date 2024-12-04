import path from "node:path";

import { fileHelper } from "@helpers/file/file.helper";
import { magicStrings } from "@constants/magic-strings.constants";
import { processEnv } from "@helpers/processEnv/processEnv.helper";
import { configHelper } from "@helpers/config/config.helper";
import {
  IGetFilteredArgs,
  ISpecSelectorHelper,
} from "@helpers/spec-selector/spec-selector.helper.types";

const { SPEC_NAMES, SPECS_TYPE, SPECS_FOLDER_NAME } = processEnv;

class SpecSelectorHelper implements ISpecSelectorHelper {
  private readonly excludeTextOnParallelRun = "swapping";
  private readonly specExtension = ".spec.ts";

  get(): string[] {
    const desiredSpecs = this.getDesiredNamesByNameString(SPEC_NAMES);
    return this.getFiltered({
      allSpecs: this.getAllByDir(this.getFullDir()),
      desiredSpecs,
    });
  }

  private getDesiredNamesByNameString(
    currentSpecNamesString: string,
  ): string[] {
    return currentSpecNamesString.length
      ? currentSpecNamesString
          .split(",")
          .map(testName =>
            !testName.endsWith(this.specExtension)
              ? `${testName}${this.specExtension}`
              : testName,
          )
      : [];
  }

  private getFiltered(args: IGetFilteredArgs): string[] {
    const { allSpecs, desiredSpecs } = args;
    return desiredSpecs.length
      ? allSpecs.filter(specFileName => desiredSpecs.includes(specFileName))
      : allSpecs;
  }

  private getAllByDir(dir: string): string[] {
    return fileHelper
      .getFilePathsFromDirSync(dir, {
        excludeText:
          configHelper.isParallelRun() && this.excludeTextOnParallelRun,
      })
      .map(specFilePath => path.basename(specFilePath));
  }

  private getFullDir(): string {
    return `${this.getRootDirByType(SPECS_TYPE)}${
      SPECS_FOLDER_NAME ? `/${SPECS_FOLDER_NAME}` : ""
    }`;
  }

  private getRootDirByType(type: string): string {
    switch (type) {
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

export const specSelectorHelper = new SpecSelectorHelper();
