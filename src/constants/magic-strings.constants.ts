import { AppName } from "./apps.constants";

export const magicStrings = {
  url: {
    [AppName.AppMento]: {
      web: { prod: { base: "https://app.mento.org" } },
      api: { prod: { base: "" } },
    },
    [AppName.Governance]: {
      web: { prod: { base: "https://governance.mento.org" } },
      api: { prod: { base: "" } },
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
