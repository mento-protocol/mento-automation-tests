import { Address } from "viem";
import { AppName } from "./apps.constants";
import { primitiveHelper } from "@helpers/primitive/primitive.helper";
import { processEnv } from "@helpers/processEnv/processEnv.helper";
import { governanceAbi } from "./abi.constants";

export const executeTitleSuffix = "(To Execute)";
const mainnetDetails = {
  name: "Celo",
  rpcUrl: "https://forno.celo.org",
  chainId: 42220,
  symbol: "CELO",
};
const testnetDetails = {
  name: "Celo Sepolia",
  rpcUrl: "https://forno.celo-sepolia.celo-testnet.org",
  chainId: 11142220,
  symbol: "CELO",
};

export const magicStrings = {
  env: {
    qa: "qa",
    prod: "prod",
    custom: "custom",
  },
  url: {
    [AppName.AppMento]: {
      web: {
        prod: { base: "https://app.mento.org" },
        qa: { base: "" },
        custom: { base: processEnv.CUSTOM_URL },
      },
      api: {
        prod: { base: "" },
        qa: { base: "" },
      },
    },
    [AppName.Governance]: {
      web: {
        prod: { base: "https://governance.mento.org" },
        qa: { base: "https://governancementoorg-qa.vercel.app" },
        custom: { base: processEnv.CUSTOM_URL },
      },
      api: {
        prod: { base: processEnv.GOVERNANCE_PROD_API_URL },
        qa: { base: processEnv.GOVERNANCE_QA_API_URL },
      },
    },
    [AppName.SquidRouter]: {
      web: { prod: { base: "https://app.squidrouter.com" } },
      api: { prod: { base: "" } },
    },
  },
  chain: {
    testnet: { ...testnetDetails },
    mainnet: { ...mainnetDetails },
    mainnetFork: { ...mainnetDetails, rpcUrl: "http://localhost:8545" },
    testnetFork: { ...testnetDetails, rpcUrl: "http://localhost:8545" },
  },
  governance: {
    abi: governanceAbi,
    testnet: {
      governorAddress: "0x23173Ac37b8E4e5a60d787aC543B3F51e8f398b4" as Address,
    },
    mainnet: {
      governorAddress: "0x47036d78bB3169b4F5560dD77BF93f4412A59852" as Address,
    },
    generateProposalData({
      shouldMarkToExecute: shouldMarkToExecute = false,
    }: { shouldMarkToExecute?: boolean } = {}) {
      const titleSuffix = shouldMarkToExecute ? executeTitleSuffix : "";
      return {
        title: `[${primitiveHelper.string.generateId()}] AQA Proposal ${titleSuffix}`,
        description: `AQA Proposal Description - ${primitiveHelper.string.generateRandom(
          73,
        )}`,
        executionCode: [
          {
            // 'Ping' contract and its function to call (Celo Sepolia)
            address: "0x76B0E353669A2C699c813A9352ab09a17e529A45" as Address,
            value: 0,
            data: "0x5c36b186",
          },
        ],
      };
    },
  },
  path: {
    root: process.cwd(),
    get artifacts() {
      return `${this.root}/artifacts`;
    },
    get screenshots() {
      return `${this.root}/artifacts/screenshots`;
    },
    get allSpecs() {
      return `${this.root}/specs`;
    },
    get appMento() {
      return {
        webSpecs: `${this.root}/specs/app-mento/web`,
        apiSpecs: `${this.root}/specs/app-mento/api`,
      };
    },
    get governance() {
      return {
        webSpecs: `${this.root}/specs/governance/web`,
        apiSpecs: `${this.root}/specs/governance/api`,
      };
    },
    get squidRouter() {
      return {
        webSpecs: `${this.root}/specs/squid-router/web`,
        apiSpecs: `${this.root}/specs/squid-router/api`,
      };
    },
  },
};

export interface IChainDetails {
  name: string;
  rpcUrl: string;
  chainId: number;
  symbol: string;
}
