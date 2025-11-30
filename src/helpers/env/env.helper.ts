import { Address } from "viem";

import { processEnv } from "@helpers/processEnv/processEnv.helper";
import { magicStrings } from "@constants/magic-strings.constants";
import { primitiveHelper } from "@helpers/primitive/primitive.helper";
import { AppName } from "@constants/apps.constants";
import { web3Helper } from "@helpers/web3/web3.helper";
import { Env } from "./env.types";

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
    if (this.isCustomUrl()) return "custom";
    return ENV;
  }

  getBaseWebUrl(): string {
    return magicStrings.url[this.getApp()].web[this.getEnv()].base;
  }

  getBaseApiUrl(): string {
    if (this.isCustomUrl()) {
      return this.getApp() === AppName.AppMento
        ? magicStrings.url["app-mento"].api.prod.base
        : magicStrings.url["governance"].api.qa.base;
    }
    return magicStrings.url[this.getApp()].api[this.getEnv()].base;
  }

  getSeedPhrase(): string {
    return SEED_PHRASE;
  }

  getWalletPassword(): string {
    return WALLET_PASSWORD;
  }

  getPrivateKey(): string {
    const mnemonicSeedPhrase = this.getSeedPhrase();
    return web3Helper.extractPrivateKey(mnemonicSeedPhrase);
  }

  getApp(): AppName {
    return APP_NAME as AppName;
  }

  getChainName(): string {
    return this.isMainnet()
      ? magicStrings.chain.mainnet.name
      : magicStrings.chain.testnet.name;
  }

  getChainType(): string {
    return this.isMainnet() ? "mainnet" : "testnet";
  }

  getChainId(): number {
    return this.isMainnet()
      ? magicStrings.chain.mainnet.chainId
      : magicStrings.chain.testnet.chainId;
  }

  getGovernorAddress(): Address {
    return magicStrings.governance[this.getChainType()].governorAddress;
  }

  getRpcUrl(): string {
    return magicStrings.chain[this.getChainType()].rpcUrl;
  }

  getGovernanceApiKey(): string {
    return this.isProd()
      ? processEnv.GOVERNANCE_PROD_API_KEY
      : processEnv.GOVERNANCE_QA_API_KEY;
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

  isProd(): boolean {
    return this.getEnv() === Env.prod;
  }
}

export enum Chain {
  Mainnet = "mainnet",
  Testnet = "testnet",
}

export const envHelper = new EnvHelper();
