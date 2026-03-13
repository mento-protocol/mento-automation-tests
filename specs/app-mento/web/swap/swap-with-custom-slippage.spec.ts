import { expect } from "@fixtures/test.fixture";
import { getSwapAmount, Token } from "@constants/token.constants";
import { testHelper } from "@helpers/test/test.helper";
import { IExecution } from "@helpers/test/test.types";
import { TestTag } from "@constants/test.constants";
import { envHelper } from "@helpers/env/env.helper";

const isFork = envHelper.isFork();
const defaultSwapAmount = getSwapAmount({ isFork });

const testCases = [
  {
    name: `default`,
    slippage: undefined,
    id: "T751161b4",
    disable: {
      reason: "Default slippage is set by default for all swap tests",
    },
  },
  {
    name: `minimal`,
    slippage: "0.1",
    id: "T0046ec8d",
  },
  {
    name: `max`,
    slippage: "20",
    id: "Tb9505e3a",
  },
];
const tokens = { sell: Token.USDm, buy: Token.GBPm };

testHelper.runSuite({
  name: "Swap - Custom Slippage",
  tags: [TestTag.Regression, TestTag.Sequential],
  beforeEach: async ({ web }) =>
    await web.app.appMento.main.runSwapTestPreconditions({ isFork }),
  tests: [
    ...testCases.map(testCase => {
      return {
        name: `perform with '${testCase.name}' slippage (${tokens.sell}/${tokens.buy})`,
        testCaseId: testCase.id,
        disable: testCase?.disable,
        test: async ({ web }: IExecution) => {
          const app = web.app.appMento;
          const initialBalance = await app.main.getTokenBalanceByName(
            tokens.buy,
          );

          await app.swap.fillForm({
            slippage: testCase.slippage,
            sellAmount: defaultSwapAmount,
          });
          expect.soft(await app.swap.isRateThere()).toBeTruthy();
          await app.swap.start();
          await app.main.expectIncreasedBalance({
            tokenName: tokens.buy,
            initialBalance,
          });
        },
      };
    }),
  ],
});
