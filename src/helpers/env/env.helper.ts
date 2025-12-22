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
  IS_FORK,
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
        ? magicStrings.url["app-mento"].api.testnet.base
        : magicStrings.url["governance"].api.testnet.base;
    }
    return magicStrings.url[this.getApp()].api[this.getChainType()].base;
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

  getGovernanceApiKey(): string {
    return this.isMainnet()
      ? processEnv.GOVERNANCE_MAINNET_API_KEY
      : processEnv.GOVERNANCE_TESTNET_API_KEY;
  }

  getChainDetails() {
    if (this.isFork()) {
      return this.isMainnet()
        ? magicStrings.chain.mainnetFork
        : magicStrings.chain.testnetFork;
    }
    return this.isMainnet()
      ? magicStrings.chain.mainnet
      : magicStrings.chain.testnet;
  }

  getRpcUrl(): string {
    if (this.isFork()) {
      return this.isMainnet()
        ? magicStrings.chain.mainnetFork.rpcUrl
        : magicStrings.chain.testnetFork.rpcUrl;
    }
    return magicStrings.chain[this.getChainType()].rpcUrl;
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

  isFork(): boolean {
    return primitiveHelper.string.toBoolean(IS_FORK);
  }
}

export enum Chain {
  Mainnet = "mainnet",
  Testnet = "testnet",
}

export const envHelper = new EnvHelper();
