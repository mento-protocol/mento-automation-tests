import { expect } from "@fixtures/test.fixture";
import { defaultSwapAmount, Token } from "@constants/token.constants";
import { suite } from "@helpers/suite/suite.helper";
import { IExecution } from "@helpers/suite/suite.types";
import { TestTag } from "@constants/test.constants";
import { testSuites } from "@constants/test-suites.constant";
import { waiterHelper } from "@helpers/waiter/waiter.helper";

const testCases = testSuites.swap.tokenSelections;

suite({
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
          tokens: {
            sell: Token.BRLm,
            buy: Token.USDm,
            clicksOnSellTokenButton: 1,
          },
        });
        await app.swap.swapInputs();
        expect(await app.swap.getCurrentSellTokenName()).toEqual(Token.CELO);
        expect(await app.swap.getCurrentBuyTokenName()).toEqual(Token.BRLm);
      },
    },
    ...testCases.map(testCase => {
      return {
        name: `"${testCase.token}" token selections`,
        testCaseId: testCase.id,
        disable: { reason: "Disabled until we have all token routes" },
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
