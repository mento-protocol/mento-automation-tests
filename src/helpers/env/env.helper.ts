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
  CHAIN_NAME,
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
    return {
      [AppName.AppMento]: AppName.AppMento,
      [AppName.Governance]: AppName.Governance,
      [AppName.SquidRouter]: AppName.SquidRouter,
    }[APP_NAME];
  }

  getChainName(): ChainName {
    return {
      [ChainName.Celo]: ChainName.Celo,
      [ChainName.CeloSepolia]: ChainName.CeloSepolia,
      [ChainName.Monad]: ChainName.Monad,
      [ChainName.MonadTestnet]: ChainName.MonadTestnet,
    }[CHAIN_NAME];
  }

  getChainType(): ChainType {
    return this.isMainnet() ? ChainType.Mainnet : ChainType.Testnet;
  }

  getChainId(): number {
    return magicStrings.chain[this.getChainName()][this.getChainType()].chainId;
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
    const chainName = this.getChainName();
    const chainType = this.getChainType();
    return this.isFork()
      ? magicStrings.chain[chainName].fork[chainType]
      : magicStrings.chain[chainName][chainType];
  }

  getRpcUrl(): string {
    return this.getChainDetails().rpcUrl;
  }

  getChainToSwitch(): { type: ChainType; name: ChainName } {
    const chains = [
      { type: ChainType.Mainnet, name: ChainName.Celo },
      { type: ChainType.Testnet, name: ChainName.CeloSepolia },
      { type: ChainType.Mainnet, name: ChainName.Monad },
      { type: ChainType.Testnet, name: ChainName.MonadTestnet },
    ];
    const currentChainName = this.getChainName();
    const currentChainType = this.getChainType();
    return chains.find(
      chain =>
        !chain.name.includes(currentChainName) &&
        chain.type === currentChainType,
    );
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

export enum ChainType {
  Mainnet = "mainnet",
  Testnet = "testnet",
}

export enum ChainName {
  Celo = "Celo",
  CeloSepolia = "Celo Sepolia Testnet",
  Monad = "Monad",
  MonadTestnet = "Monad Testnet",
}

export const envHelper = new EnvHelper();
