import { Address } from "viem";
import { TokenSymbol as MentoSdkTokenSymbol } from "@mento-protocol/mento-sdk";

export enum Token {
  "USDC" = "USDC",
  "USDT" = "USDT",
  "USD₮" = "USD₮",
  "CELO" = "CELO",
  "EURm" = "EURm",
  "USDm" = "USDm",
  "BRLm" = "BRLm",
  "COPm" = "COPm",
  "axlEUROC" = "axlEUROC",
  "axlUSDC" = "axlUSDC",
  "KESm" = "KESm",
  "XOFm" = "XOFm",
  "PHPm" = "PHPm",
  "GHSm" = "GHSm",
  "GBPm" = "GBPm",
  "ZARm" = "ZARm",
  "CADm" = "CADm",
  "AUDm" = "AUDm",
  "CHFm" = "CHFm",
  "NGNm" = "NGNm",
  "JPYm" = "JPYm",
}

export const TokenSymbol = MentoSdkTokenSymbol;

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

export const holdersByChain = {
  // TODO: Add testnet holders
  mainnet: {
    "0x9380fA34Fd9e4Fd14c06305fd7B6199089eD4eb9": [
      // TODO: Fix USD₮ TokenSymbol usage
      // TokenSymbol.USDT,
      TokenSymbol.USDC,
      Token.axlUSDC,
      Token.axlEUROC,
    ],
    "0xB5BBea2325a8f5a0130a1Aaa372bA768F1C62c43": [TokenSymbol.USDm],
    "0x59aBE068150BE95582479a405f2734cB533f9354": [TokenSymbol.AUDm],
    "0x0D95d04c72fe3B0F17963779138C504Fdd365C03": [TokenSymbol.CADm],
    "0x1aa2f83357150F811B1010c00020AbE1462feB01": [TokenSymbol.CHFm],
    "0x6619871118D144c1c28eC3b23036FC1f0829ed3a": [TokenSymbol.COPm],
    "0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73": [TokenSymbol.EURm],
    "0xb1ea2E17C8aBCFA5Ba111c92A9a1ad8C5728153f": [TokenSymbol.GBPm],
    "0x6bab3afa6d0c42d539bcbc33ffb68c0406913413": [TokenSymbol.GHSm],
    "0x04fEAE0d4a3D0051397Ee09314dAD768a37Fb539": [TokenSymbol.JPYm],
    "0x61Ef8708fc240DC7f9F2c0d81c3124Df2fd8829F": [TokenSymbol.KESm],
    "0x1e2F87e1f8056Fcd39695aAeb63cb475E1DD2318": [TokenSymbol.NGNm],
    "0x1625fe58cdb3726e5841fb2bb367dde9aaa009b3": [TokenSymbol.BRLm],
    "0xb793ff8031FCe64b3f553DBf40a70370FDEAC1C7": [TokenSymbol.ZARm],
    "0x625cb959213d18a9853973c2220df7287f1e5b7d": [TokenSymbol.XOFm],
    "0x87deC9a2589d9e6511Df84C193561b3A16cF6238": [TokenSymbol.PHPm],
  },
};
