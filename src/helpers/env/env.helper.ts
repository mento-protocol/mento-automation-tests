import { processEnv } from "@helpers/processEnv/processEnv.helper";
import { magicStrings } from "@constants/magic-strings.constants";
import { primitiveHelper } from "@helpers/primitive/primitive.helper";

const { ENV, CI } = processEnv;

export class EnvHelper {
  getEnv(): string {
    return ENV;
  }

  getBaseWebUrl(): string {
    return magicStrings.url.web[this.getEnv()].base;
  }

  getBaseApiUrl(): string {
    return magicStrings.url.api[this.getEnv()].base;
  }

  isCI(): boolean {
    return primitiveHelper.string.toBoolean(CI);
  }
}

export const envHelper = new EnvHelper();
