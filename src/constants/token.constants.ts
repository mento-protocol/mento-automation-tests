import { Address } from "viem";
import { TokenSymbol as Token } from "@mento-protocol/mento-sdk";

export { Token };

export const defaultSwapAmount = "0.01";

export const forkSwapAmount = "50";

export const getDefaultSwapAmount = ({
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
      // Token.USDT,
      Token.USDC,
      Token.axlUSDC,
      Token.axlEUROC,
    ],
    "0xB5BBea2325a8f5a0130a1Aaa372bA768F1C62c43": [Token.USDm],
    "0x59aBE068150BE95582479a405f2734cB533f9354": [Token.AUDm],
    "0x0D95d04c72fe3B0F17963779138C504Fdd365C03": [Token.CADm],
    "0x1aa2f83357150F811B1010c00020AbE1462feB01": [Token.CHFm],
    "0x6619871118D144c1c28eC3b23036FC1f0829ed3a": [Token.COPm],
    "0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73": [Token.EURm],
    "0xb1ea2E17C8aBCFA5Ba111c92A9a1ad8C5728153f": [Token.GBPm],
    "0x6bab3afa6d0c42d539bcbc33ffb68c0406913413": [Token.GHSm],
    "0x04fEAE0d4a3D0051397Ee09314dAD768a37Fb539": [Token.JPYm],
    "0x61Ef8708fc240DC7f9F2c0d81c3124Df2fd8829F": [Token.KESm],
    "0x1e2F87e1f8056Fcd39695aAeb63cb475E1DD2318": [Token.NGNm],
    "0x1625fe58cdb3726e5841fb2bb367dde9aaa009b3": [Token.BRLm],
    "0xb793ff8031FCe64b3f553DBf40a70370FDEAC1C7": [Token.ZARm],
    "0x625cb959213d18a9853973c2220df7287f1e5b7d": [Token.XOFm],
    "0x87deC9a2589d9e6511Df84C193561b3A16cF6238": [Token.PHPm],
  },
};
