import { Address } from "viem";
import { TokenSymbol as MentoSdkTokenSymbol } from "@mento-protocol/mento-sdk";

export enum Token {
  "USDC" = "USDC",
  "USDT" = "USDT",
  "USD₮" = "USD₮",
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

export const TokenSymbol = MentoSdkTokenSymbol;

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
export const forkSwapAmount = "50";
export const getSwapAmount = ({
  isFork = false,
}: {
  isFork?: boolean;
} = {}): string => (isFork ? forkSwapAmount : defaultSwapAmount);

export const testWalletAddresses = {
  main: "0x98CAAa8F2B4436df0229B1cA18582d4023220e51",
  reserve: "0x5C70940F5cB98316C2Dd7FC6fD24c718cc0D02F5",
} as Record<string, Address>;

export const tokenAddresses = {
  mainnet: {},
  testnet: {
    mento: "0x07867fd40EB56b4380bE39c88D0a7EA59Aa99A20",
    veMento: "0xB72320fC501cb30E55bAF0DA48c20b11fAc9f79D",
  },
} as Record<string, Record<string, Address>>;
