import { defaultSwapAmount, Token } from "@constants/token.constants";
import { suite } from "@helpers/suite/suite.helper";
import { IExecution } from "@helpers/suite/suite.types";
import { retryDataHelper } from "@helpers/retry-data/retry-data.helper";
import { TestTag } from "@constants/test.constants";

const testCases = [
  // CELO
  {
    fromToken: Token.CELO,
    toToken: Token.cUSD,
    id: "Tb3ad24f0",
    disable: { reason: "It's default pair for other tests" },
  },
  {
    fromToken: Token.CELO,
    toToken: Token.cEUR,
    id: "T3af02715",
  },
  {
    fromToken: Token.CELO,
    toToken: Token.cREAL,
    id: "T2a476441",
  },
  {
    fromToken: Token.CELO,
    toToken: Token.eXOF,
    id: "T13fb8467",
  },
  // USDT
  {
    fromToken: Token.USDT,
    toToken: Token.cUSD,
    id: "T2511996c",
  },
  // cKES
  {
    fromToken: Token.cKES,
    toToken: Token.cUSD,
    id: "Tbe02fb8d",
    fromAmount: "0.1",
  },
  // PUSO
  {
    fromToken: Token.PUSO,
    toToken: Token.cUSD,
    id: "T7d8911a6",
  },
  // cCOP
  {
    fromToken: Token.cCOP,
    toToken: Token.cUSD,
    fromAmount: "45",
    id: "Ta2aa287f",
  },
  // USDC
  {
    fromToken: Token.USDC,
    toToken: retryDataHelper.getRandomToken(Token.USDC, [
      Token.cEUR,
      Token.cUSD,
      Token.cREAL,
    ]),
    id: "Ta9f2be1e",
  },
  // axlUSDC
  {
    fromToken: Token.axlUSDC,
    toToken: retryDataHelper.getRandomToken(Token.axlUSDC, [
      Token.cEUR,
      Token.cUSD,
      Token.cREAL,
    ]),
    id: "T635a15c9",
  },
  // axlEUROC
  {
    fromToken: Token.axlEUROC,
    toToken: retryDataHelper.getRandomToken(Token.axlEUROC, [
      Token.cEUR,
      Token.cUSD,
    ]),
    id: "T92258405",
  },
  // cGHS
  {
    fromToken: Token.cGHS,
    toToken: retryDataHelper.getRandomToken(Token.cGHS, [
      Token.cUSD,
      Token.USDC,
      Token.USDT,
    ]),
    id: "T8da32b9f",
    fromAmount: "0.1",
  },
  // cGBP
  {
    fromToken: Token.cGBP,
    toToken: Token.cUSD,
    id: "T22f94bbb",
  },
  // cZAR
  {
    fromToken: Token.cZAR,
    toToken: Token.cUSD,
    id: "T4b1b444b",
    fromAmount: "0.1",
  },
  // cCAD
  {
    fromToken: Token.cCAD,
    toToken: Token.cUSD,
    id: "T0869d367",
  },
  // cAUD
  {
    fromToken: Token.cAUD,
    toToken: Token.cUSD,
    id: "T1d46dc17",
  },
  // cCHF
  {
    fromToken: Token.cCHF,
    toToken: Token.cUSD,
    id: "Tc750f6e5",
  },
  // cNGN
  {
    fromToken: Token.cNGN,
    fromAmount: "10",
    toToken: Token.cUSD,
    id: "T280cb27f",
  },
  // cJPY
  {
    fromToken: Token.cJPY,
    toToken: Token.cUSD,
    id: "T36d94360",
    fromAmount: "0.1",
  },
];

suite({
  name: "Swap - By token pairs",
  tags: [TestTag.Regression, TestTag.Sequential],
  beforeEach: async ({ web }) =>
    await web.app.appMento.main.runSwapTestPreconditions(),
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
