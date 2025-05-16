import { defaultSwapAmount, Token } from "@constants/token.constants";
import { suite } from "@helpers/suite/suite.helper";
import { IExecution } from "@helpers/suite/suite.types";
import { retryDataHelper } from "@helpers/retry-data/retry-data.helper";

const testCases = [
  // CELO
  {
    fromToken: Token.CELO,
    toToken: Token.cUSD,
    id: "@Tb3ad24f0",
    disable: { reason: "It's default pair for other tests" },
  },
  {
    fromToken: Token.CELO,
    toToken: Token.cEUR,
    id: "@T3af02715",
  },
  {
    fromToken: Token.CELO,
    toToken: Token.cREAL,
    id: "@T2a476441",
  },
  {
    fromToken: Token.CELO,
    toToken: Token.eXOF,
    id: "@T13fb8467",
  },
  // USDT
  {
    fromToken: Token.USDT,
    toToken: Token.cUSD,
    id: "@T2511996c",
  },
  // cKES
  {
    fromToken: Token.cKES,
    toToken: Token.cUSD,
    id: "@Tbe02fb8d",
  },
  // PUSO
  {
    fromToken: Token.PUSO,
    toToken: Token.cUSD,
    id: "@T7d8911a6",
  },
  // cCOP
  {
    fromToken: Token.cCOP,
    toToken: Token.cUSD,
    fromAmount: "430",
    id: "@Ta2aa287f",
  },
  // USDC
  {
    fromToken: Token.USDC,
    toToken: retryDataHelper.getRandomToken(Token.USDC, [
      Token.cEUR,
      Token.cUSD,
      Token.cREAL,
    ]),
    id: "@Ta9f2be1e",
  },
  // axlUSDC
  {
    fromToken: Token.axlUSDC,
    toToken: retryDataHelper.getRandomToken(Token.axlUSDC, [
      Token.cEUR,
      Token.cUSD,
      Token.cREAL,
    ]),
    id: "@T635a15c9",
  },
  // axlEUROC
  {
    fromToken: Token.axlEUROC,
    toToken: retryDataHelper.getRandomToken(Token.axlEUROC, [
      Token.cEUR,
      Token.eXOF,
    ]),
    id: "@T92258405",
  },
  // cGHS
  {
    fromToken: Token.cGHS,
    toToken: retryDataHelper.getRandomToken(Token.cGHS, [
      Token.CELO,
      Token.cUSD,
      Token.USDC,
      Token.USDT,
    ]),
    id: "@T8da32b9f",
    fromAmount: "0.1",
  },
  // cGBP
  {
    fromToken: Token.cGBP,
    toToken: retryDataHelper.getRandomToken(Token.cGBP, [
      Token.CELO,
      Token.cUSD,
    ]),
    id: "@T22f94bbb",
  },
  // cZAR
  {
    fromToken: Token.cZAR,
    toToken: Token.cUSD,
    id: "@T4b1b444b",
    fromAmount: "0.1",
  },
  // cCAD
  {
    fromToken: Token.cCAD,
    toToken: retryDataHelper.getRandomToken(Token.cCAD, [
      Token.CELO,
      Token.cUSD,
    ]),
    id: "@T0869d367",
  },
  // cAUD
  {
    fromToken: Token.cAUD,
    toToken: retryDataHelper.getRandomToken(Token.cAUD, [
      Token.CELO,
      Token.cUSD,
    ]),
    id: "@T1d46dc17",
  },
];

suite({
  name: "Swap - By token pairs",
  beforeEach: async ({ web }) => {
    await web.main.runSwapTestPreconditions();
  },
  tests: [
    ...testCases.map(testCase => {
      return {
        name: `from ${testCase.fromToken} to ${testCase.toToken}`,
        testCaseId: testCase.id,
        disable: testCase?.disable,
        test: async ({ web }: IExecution) => {
          const initialBalance = await web.main.getTokenBalanceByName(
            testCase.toToken,
          );
          await web.swap.fillForm({
            tokens: { from: testCase.fromToken, to: testCase.toToken },
            fromAmount: testCase?.fromAmount || defaultSwapAmount,
          });
          await web.swap.start();
          await web.swap.confirm.confirm();
          await web.main.expectIncreasedBalance({
            initialBalance,
            tokenName: testCase.toToken,
          });
        },
      };
    }),
  ],
});
