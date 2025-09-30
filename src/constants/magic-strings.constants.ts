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
      name: "Celo Alfajores",
      rpcUrl: "https://alfajores-forno.celo-testnet.org",
      chainId: 44787,
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
      governorAddress: "0x558e92236f85Bb4e8A63ec0D5Bf9d34087Eab744" as Address,
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
            // 'Ping' contract and its function to call
            address: "0xcee517fc3e11b41df43baa7bab9542625187e259" as Address,
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
