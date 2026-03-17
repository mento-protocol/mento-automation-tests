import { expect } from "@fixtures/test.fixture";
import { getDefaultSwapAmount, Token } from "@constants/token.constants";
import { testHelper } from "@helpers/test/test.helper";
import { TestTag } from "@constants/test.constants";
import { envHelper } from "@helpers/env/env.helper";

const isFork = envHelper.isFork();
const defaultSwapAmount = getDefaultSwapAmount({ isFork });
const pairs = {
  rejectApproval: {
    sell: Token.PHPm,
    buy: Token.USDm,
  },
  rejectSwap: {
    sell: Token.USDm,
    buy: Token.BRLm,
  },
};

testHelper.runSuite({
  name: "Swap - Transaction rejection",
  tags: [TestTag.Regression, TestTag.Sequential],
  beforeEach: async ({ web }) =>
    await web.app.appMento.main.runSwapTestPreconditions({ isFork }),
  tests: [
    {
      name: `Reject approval tx (${pairs.rejectApproval.sell}/${pairs.rejectApproval.buy})`,
      testCaseId: "Td5aa1954",
      test: async ({ web }) => {
        const app = web.app.appMento;
        const sellToken = pairs.rejectApproval.sell;
        const fromTokenBalance = (
          await app.main.getTokenBalanceByName(sellToken)
        ).toString();

        await app.swap.fillForm({
          sellAmount: fromTokenBalance,
          tokens: { sell: sellToken, buy: pairs.rejectApproval.buy },
        });
        await app.swap.proceedToConfirmationWithRejection({
          rejectType: "approval",
        });

        expect(
          await app.swap.confirm.isRejectApprovalTxNotificationThere(),
        ).toBeTruthy();
      },
    },
    {
      name: `Reject swap tx (${pairs.rejectSwap.sell}/${pairs.rejectSwap.buy})`,
      testCaseId: "T09fd373a",
      test: async ({ web }) => {
        const app = web.app.appMento;
        await app.swap.fillForm({
          tokens: { sell: pairs.rejectSwap.sell, buy: pairs.rejectSwap.buy },
          sellAmount: defaultSwapAmount,
        });
        await app.swap.proceedToConfirmationWithRejection({
          rejectType: "swap",
        });

        expect(
          await app.swap.confirm.isRejectSwapTxNotificationThere(),
        ).toBeTruthy();
      },
    },
  ],
});
