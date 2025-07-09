import { processEnv } from "@helpers/processEnv/processEnv.helper";
import { magicStrings } from "@constants/magic-strings.constants";
import { primitiveHelper } from "@helpers/primitive/primitive.helper";
import { AppName } from "@constants/apps.constants";

const {
  ENV,
  CI,
  CUSTOM_URL,
  IS_MAINNET,
  SEED_PHRASE,
  WALLET_PASSWORD,
  APP_NAME,
} = processEnv;

export class EnvHelper {
  getEnv(): string {
    return ENV;
  }

  getBaseWebUrl(): string {
    if (this.isCustomUrl()) {
      return CUSTOM_URL;
    }
    return magicStrings.url[this.getApp()].web[this.getEnv()].base;
  }

  getBaseApiUrl(): string {
    return magicStrings.url[this.getApp()].api[this.getEnv()].base;
  }

  getSeedPhrase(): string {
    return SEED_PHRASE;
  }

  getWalletPassword(): string {
    return WALLET_PASSWORD;
  }

  getApp(): AppName {
    return APP_NAME as AppName;
  }

  isCI(): boolean {
    return primitiveHelper.string.toBoolean(CI);
  }

  isMainnet(): boolean {
    return primitiveHelper.string.toBoolean(IS_MAINNET);
  }

  isCustomUrl(): boolean {
    return Boolean(CUSTOM_URL?.length);
  }
}

export const envHelper = new EnvHelper();
