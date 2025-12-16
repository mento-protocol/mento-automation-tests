import { getSwapAmount, Token } from "@constants/token.constants";
import { suite } from "@helpers/suite/suite.helper";
import { IExecution } from "@helpers/suite/suite.types";
import { retryDataHelper } from "@helpers/retry-data/retry-data.helper";
import { TestTag } from "@constants/test.constants";
import { envHelper } from "@helpers/env/env.helper";
import { magicStrings } from "@constants/magic-strings.constants";

const isFork = envHelper.isFork();
const defaultSwapAmount = getSwapAmount({ isFork });
// USD₮ on mainnet and USDT on testnet
const usdtToken = Token[envHelper.isMainnet ? "USD₮" : "USDT"];
const testCases = [
  // CELO
  {
    fromToken: Token.CELO,
    toToken: Token.USDm,
    id: "Tb3ad24f0",
    disable: { reason: "It's default pair for other tests" },
  },
  {
    fromToken: Token.CELO,
    toToken: Token.EURm,
    id: "T3af02715",
  },
  {
    fromToken: Token.CELO,
    toToken: Token.BRLm,
    id: "T2a476441",
  },
  {
    fromToken: Token.CELO,
    toToken: Token.XOFm,
    id: "T13fb8467",
  },
  // USDT
  {
    fromToken: Token.USDT,
    toToken: Token.USDm,
    id: "T2511996c",
    disable: {
      reason: "Unsupported token",
      chain: magicStrings.chain.mainnet.name,
    },
  },
  // USD₮
  {
    fromToken: Token["USD₮"],
    toToken: Token.USDm,
    id: "T2511996c",
    disable: {
      reason: "Unsupported token",
      chain: magicStrings.chain.testnet.name,
    },
  },
  // cKES
  {
    fromToken: Token.KESm,
    toToken: Token.USDm,
    id: "Tbe02fb8d",
    fromAmount: "0.1",
  },
  // PUSO
  {
    fromToken: Token.PHPm,
    toToken: Token.USDm,
    id: "T7d8911a6",
  },
  // cCOP
  {
    fromToken: Token.COPm,
    toToken: Token.USDm,
    fromAmount: "45",
    id: "Ta2aa287f",
  },
  // USDC
  {
    fromToken: Token.USDC,
    toToken: retryDataHelper.getRandomToken(Token.USDC, [
      Token.EURm,
      Token.USDm,
      Token.BRLm,
    ]),
    id: "Ta9f2be1e",
  },
  // axlUSDC
  {
    fromToken: Token.axlUSDC,
    toToken: retryDataHelper.getRandomToken(Token.axlUSDC, [
      Token.EURm,
      Token.USDm,
      Token.BRLm,
    ]),
    id: "T635a15c9",
  },
  // axlEUROC
  {
    fromToken: Token.axlEUROC,
    toToken: retryDataHelper.getRandomToken(Token.axlEUROC, [
      Token.EURm,
      Token.USDm,
    ]),
    id: "T92258405",
  },
  // cGHS
  {
    fromToken: Token.GHSm,
    toToken: retryDataHelper.getRandomToken(Token.GHSm, [
      Token.USDm,
      Token.USDC,
      usdtToken,
    ]),
    id: "T8da32b9f",
    fromAmount: "0.1",
  },
  // cGBP
  {
    fromToken: Token.GBPm,
    toToken: Token.USDm,
    id: "T22f94bbb",
  },
  // cZAR
  {
    fromToken: Token.ZARm,
    toToken: Token.USDm,
    id: "T4b1b444b",
    fromAmount: "0.1",
  },
  // cCAD
  {
    fromToken: Token.CADm,
    toToken: Token.USDm,
    id: "T0869d367",
  },
  // cAUD
  {
    fromToken: Token.AUDm,
    toToken: Token.USDm,
    id: "T1d46dc17",
  },
  // cCHF
  {
    fromToken: Token.CHFm,
    toToken: Token.USDm,
    id: "Tc750f6e5",
  },
  // cNGN
  {
    fromToken: Token.NGNm,
    fromAmount: "0.50",
    toToken: Token.USDm,
    id: "T280cb27f",
  },
  // cJPY
  {
    fromToken: Token.JPYm,
    toToken: Token.USDm,
    id: "T36d94360",
    fromAmount: "0.1",
  },
];

suite({
  name: "Swap - By token pairs",
  tags: [TestTag.Regression, TestTag.Sequential],
  beforeEach: async ({ web }) =>
    await web.app.appMento.main.runSwapTestPreconditions({ isFork }),
  tests: [
    ...testCases.map(testCase => {
      return {
        name: `from ${testCase.fromToken} to ${testCase.toToken}`,
        testCaseId: testCase.id,
        disable: testCase?.disable,
        test: async ({ web }: IExecution) => {
          const app = web.app.appMento;
          const initialBalance = await app.main.getTokenBalanceByName(
            testCase.toToken,
          );
          await app.swap.fillForm({
            tokens: {
              sell: testCase.fromToken,
              buy: testCase.toToken,
            },
            sellAmount: testCase?.fromAmount || defaultSwapAmount,
          });
          await app.swap.start();
          await app.main.expectIncreasedBalance({
            initialBalance,
            tokenName: testCase.toToken,
          });
        },
      };
    }),
  ],
});
