import { Token } from "@constants/token.constants";
import { suite } from "@helpers/suite/suite.helper";
import { IExecution } from "@helpers/suite/suite.types";
import { primitiveHelper } from "@helpers/primitive/primitive.helper";

const disable = {
  reason: "No valid median for a bunch of tokens",
  link: "https://app.zenhub.com/workspaces/sprint-6458911097b7ec002c15f0d6/issues/gh/mento-protocol/mento-web/152",
};
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
    disable,
  },
  // cKES
  {
    fromToken: Token.cKES,
    toToken: Token.cUSD,
    id: "@Tbe02fb8d",
    disable,
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
    id: "@Ta2aa287f",
  },
  // USDC
  {
    fromToken: Token.USDC,
    toToken: primitiveHelper.getRandomFrom([
      Token.cEUR,
      Token.cUSD,
      Token.cREAL,
    ]),
    id: "@Ta9f2be1e",
    disable,
  },
  // axlUSDC
  {
    fromToken: Token.axlUSDC,
    toToken: primitiveHelper.getRandomFrom([
      Token.cEUR,
      Token.cUSD,
      Token.cREAL,
    ]),
    id: "@T635a15c9",
    disable,
  },
  // axlEUROC
  {
    fromToken: Token.axlEUROC,
    toToken: primitiveHelper.getRandomFrom([Token.cEUR, Token.eXOF]),
    id: "@T92258405",
    disable,
  },
];

suite({
  name: "Swap by token pairs",
  beforeAll: async ({ web, wallet }) => {
    await web.main.openAppWithConnectedWallet(wallet);
  },
  afterEach: async ({ web }) => {
    await web.swap.browser.refresh();
  },
  tests: [
    ...testCases.map(testCase => {
      return {
        name: `from ${testCase.fromToken} to ${testCase.toToken}`,
        testCaseId: testCase.id,
        disable: testCase?.disable,
        test: async ({ web, wallet }: IExecution) => {
          await web.swap.fillForm({
            tokens: { from: testCase.fromToken, to: testCase.toToken },
            fromAmount: "0.0001",
          });
          await web.swap.start();
          await wallet.helper.approveTransactionTwice();
          await web.swap.confirm.expectSuccessfulTransaction();
        },
      };
    }),
  ],
});
