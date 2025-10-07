import { Address } from "viem";
import { AppName } from "./apps.constants";
import { primitiveHelper } from "@helpers/primitive/primitive.helper";
import { processEnv } from "@helpers/processEnv/processEnv.helper";
import { governanceAbi } from "./abi.constants";

export const executeTitleSuffix = "(To Execute)";

export const magicStrings = {
  url: {
    [AppName.AppMento]: {
      web: { prod: { base: "https://app.mento.org" } },
      api: { prod: { base: "" } },
    },
    [AppName.Governance]: {
      web: {
        prod: { base: "https://governance.mento.org" },
        qa: { base: "https://governancementoorg-qa.vercel.app" },
      },
      api: {
        prod: { base: processEnv.GOVERNANCE_PROD_API_URL },
        qa: { base: processEnv.GOVERNANCE_QA_API_URL },
      },
    },
  },
  chain: {
    testnet: {
      name: "Celo Sepolia",
      rpcUrl: "https://forno.celo-sepolia.celo-testnet.org",
      chainId: 11142220,
      symbol: "CELO",
    },
    mainnet: {
      name: "Celo",
      rpcUrl: "https://forno.celo.org",
      chainId: 42220,
      symbol: "CELO",
    },
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
  },
};
