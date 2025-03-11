import { defaultSwapAmount, Token } from "@constants/token.constants";
import { suite } from "@helpers/suite/suite.helper";
import { IExecution } from "@helpers/suite/suite.types";
import { primitiveHelper } from "@helpers/primitive/primitive.helper";
import { retryDataHelper } from "@helpers/retry-data/retry-data.helper";

const testCases = [
  // CELO
  {
    fromToken: Token.CELO,
    toToken: Token.cUSD,
    id: "@Tb3ad24f0",
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
    toToken: getRandomToken(Token.USDC, [Token.cEUR, Token.cUSD, Token.cREAL]),
    id: "@Ta9f2be1e",
  },
  // axlUSDC
  {
    fromToken: Token.axlUSDC,
    toToken: getRandomToken(Token.axlUSDC, [
      Token.cEUR,
      Token.cUSD,
      Token.cREAL,
    ]),
    id: "@T635a15c9",
  },
  // axlEUROC
  {
    fromToken: Token.axlEUROC,
    toToken: getRandomToken(Token.axlEUROC, [Token.cEUR, Token.eXOF]),
    id: "@T92258405",
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

function getRandomToken(fromToken: Token, toTokens: Token[]): Token {
  if (!retryDataHelper.isExistByName(fromToken)) {
    const randomToken = primitiveHelper.getRandomFrom(toTokens);
    retryDataHelper.create({ fromToken, toToken: randomToken }, fromToken);
    return randomToken;
  }
  return retryDataHelper.getByName<Token>(fromToken).toToken;
}
