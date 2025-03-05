import { processEnv } from "@helpers/processEnv/processEnv.helper";
import { magicStrings } from "@constants/magic-strings.constants";
import { primitiveHelper } from "@helpers/primitive/primitive.helper";

const { ENV, CI, CUSTOM_URL, IS_MAINNET, SEED_PHRASE, WALLET_PASSWORD } =
  processEnv;

export class EnvHelper {
  getEnv(): string {
    return ENV;
  }

  getBaseWebUrl(): string {
    if (this.isCustomUrl()) {
      return CUSTOM_URL;
    }
    return magicStrings.url.web[this.getEnv()].base;
  }

  getBaseApiUrl(): string {
    return magicStrings.url.api[this.getEnv()].base;
  }

  getSeedPhrase(): string {
    if (!SEED_PHRASE) throw new Error("Seed phrase isn't provided");
    return SEED_PHRASE;
  }

  getWalletPassword(): string {
    if (!WALLET_PASSWORD) throw new Error("Wallet password isn't provided");
    return WALLET_PASSWORD;
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
