import path from "node:path";

import { processEnv } from "@helpers/processEnv/processEnv.helper";
import { magicStrings } from "@constants/magic-strings.constants";
import { envHelper } from "@helpers/env/env.helper";
import { primitiveHelper } from "@helpers/primitive/primitive.helper";
import { fileHelper } from "@helpers/file/file.helper";

const { SPEC_NAMES, SPECS_TYPE } = processEnv;

// todo: Move to types file
interface IGetFilteredSpecsArgs {
  desiredSpecs: string[];
  allSpecs: string[];
}

class ConfigHelper {
  private readonly excludeTextOnParallelRun = "swapping";
  private readonly specExtension = ".spec.ts";

  getSpecs(): string[] {
    const desiredSpecs = this.getDesiredSpecsByNameString(SPEC_NAMES);
    // todo: V1 working
    // const res = desiredSpecs.length
    //   ? this.getFilteredSpecs(desiredSpecs)
    //   : ["**/*.spec.ts"];
    console.log({ desiredSpecs });
    // todo: V2 working
    const res = this.getFilteredSpecs({
      allSpecs: this.getAllSpecs(),
      desiredSpecs,
    });
    console.log({ res });
    return res;
  }

  private getDesiredSpecsByNameString(
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

  private getFilteredSpecs(args: IGetFilteredSpecsArgs): string[] {
    const { allSpecs, desiredSpecs } = args;
    return desiredSpecs.length
      ? allSpecs.filter(specFileName => desiredSpecs.includes(specFileName))
      : allSpecs;
  }

  private getAllSpecs(): string[] {
    return fileHelper
      .getFilePathsFromDirSync(this.getSpecsDir(), {
        excludeText: this.isParallelRun() && this.excludeTextOnParallelRun,
      })
      .map(specFilePath => path.basename(specFilePath));
  }

  getSpecsDir(): string {
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

  getWorkers(): number {
    return this.isParallelRun() ? undefined : 1;
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

  isParallelRun(): boolean {
    return primitiveHelper.string.toBoolean(processEnv.IS_PARALLEL_RUN);
  }
}

export const configHelper = new ConfigHelper();
