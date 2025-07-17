import { Address } from "viem";
import { AppName } from "./apps.constants";
import { primitiveHelper } from "@helpers/primitive/primitive.helper";

export const magicStrings = {
  url: {
    [AppName.AppMento]: {
      web: { prod: { base: "https://app.mento.org" } },
      api: { prod: { base: "" } },
    },
    [AppName.Governance]: {
      web: {
        prod: {
          // TODO: Replace with a correct URL once deployed
          base: "https://governancementoorg-git-feature-web3-shared-package-mentolabs.vercel.app",
        },
      },
      api: {
        prod: {
          base: "",
        },
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
    abi: [
      "function propose(address[] targets, uint256[] values, bytes[] calldatas, string description) external returns (uint256)",
      "function proposalCount() external view returns (uint256)",
      "function proposals(uint256) external view returns (address proposer, uint256 id, address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, uint256 startBlock, uint256 endBlock, uint256 forVotes, uint256 againstVotes, uint256 abstainVotes, bool canceled, bool executed)",
    ],
    testnet: {
      governorAddress: "0x558e92236f85Bb4e8A63ec0D5Bf9d34087Eab744" as Address,
    },
    mainnet: {
      governorAddress: "0x47036d78bB3169b4F5560dD77BF93f4412A59852" as Address,
    },
    generateProposalData() {
      return {
        title: `[${primitiveHelper.string.generateId()}] AQA Proposal`,
        description: `AQA Proposal Description`,
        executionCode: [
          {
            address: "0x1230000000000000000000000000000000000000" as Address,
            value: 1,
            data: "0x1234",
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
