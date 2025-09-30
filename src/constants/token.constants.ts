import { Address } from "viem";

export enum Token {
  "USDC" = "USDC",
  "USDT" = "USDT",
  "CELO" = "CELO",
  "cEUR" = "cEUR",
  "cUSD" = "cUSD",
  "cREAL" = "cREAL",
  "cCOP" = "cCOP",
  "axlEUROC" = "axlEUROC",
  "axlUSDC" = "axlUSDC",
  "cKES" = "cKES",
  "eXOF" = "eXOF",
  "PUSO" = "PUSO",
  "cGHS" = "cGHS",
  "cGBP" = "cGBP",
  "cZAR" = "cZAR",
  "cCAD" = "cCAD",
  "cAUD" = "cAUD",
  "cCHF" = "cCHF",
  "cNGN" = "cNGN",
  "cJPY" = "cJPY",
}

export const cTokens = [
  Token.cEUR,
  Token.cUSD,
  Token.cREAL,
  Token.cCOP,
  Token.cKES,
];

export const otherTokens = [Token.USDC];

export const allTokens = [...cTokens, ...otherTokens, Token.CELO];

export const defaultSwapAmount = "0.01";

export const testWalletAddresses = {
  main: "0x98CAAa8F2B4436df0229B1cA18582d4023220e51",
  reserve: "0x5C70940F5cB98316C2Dd7FC6fD24c718cc0D02F5",
} as Record<string, Address>;

export const tokenAddresses = {
  mainnet: {},
  testnet: {
    mento: "0x3eDd2f7c90e2E931c817a44302Af7112E84be6Cc",
    veMento: "0x537CaE97C588C6DA64A385817F3D3563DDCf0591",
  },
} as Record<string, Record<string, Address>>;
