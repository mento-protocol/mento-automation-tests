import { expect } from "@fixtures/test.fixture";
import { defaultSwapAmount, Token } from "@constants/token.constants";
import { testHelper } from "@helpers/test/test.helper";
import { IExecution } from "@helpers/test/test.types";
import { TestTag } from "@constants/test.constants";
import { testSuites } from "@constants/test-suites.constant";
import { waiterHelper } from "@helpers/waiter/waiter.helper";

const testCases = testSuites.swap.tokenSelections;
const tokens = { sell: Token.USDm, buy: Token.ZARm };

testHelper.runSuite({
  name: "Swap - Token selections",
  tags: [TestTag.Regression, TestTag.Parallel],
  tests: [
    {
      name: "Swap token inputs",
      testCaseId: "Td88a4d31",
      test: async ({ web }) => {
        const app = web.app.appMento;
        await app.swap.fillForm({
          sellAmount: defaultSwapAmount,
          waitForLoadedRate: false,
          tokens,
        });
        await app.swap.swapInputs();
        expect(await app.swap.getCurrentSellTokenName()).toEqual(tokens.buy);
        expect(await app.swap.getCurrentBuyTokenName()).toEqual(tokens.sell);
      },
    },
    ...testCases.map(testCase => {
      return {
        name: `"${testCase.token}" token selections`,
        testCaseId: testCase.id,
        // TODO: Enable once we have all token routes defined
        disable: { reason: "Disabled until we have all token routes defined" },
        test: async ({ web }: IExecution) => {
          const app = web.app.appMento;
          if (testCase.token === Token.USDm) {
            await app.swap.swapInputs();
          }
          await app.swap.fillForm({
            tokens: { sell: testCase.token },
            waitForLoadedRate: false,
            clicksOnSellTokenButton: 1,
          });
          await app.swap.openSelectTokenModal({
            tokenType: "buy",
          });
          await waiterHelper.sleep(2000, {
            sleepReason: "To get all tokens set",
          });
          const validTokens =
            await app.swap.selectTokenModalPage.getAllValidTokenNames({
              shouldSort: true,
            });
          expect.soft(validTokens).toEqual(testCase.validTokens.sort());
          const invalidTokens =
            await app.swap.selectTokenModalPage.getAllInvalidTokenNames({
              shouldSort: true,
            });
          expect(invalidTokens).toEqual(testCase.invalidTokens.sort());
        },
      };
    }),
  ],
});
