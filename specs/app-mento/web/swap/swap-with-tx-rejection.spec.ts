import { expect } from "@fixtures/test.fixture";
import { defaultSwapAmount, Token } from "@constants/token.constants";
import { suite } from "@helpers/suite/suite.helper";
import { TestTag } from "@constants/test.constants";

const pairs = {
  rejectApproval: {
    from: Token.cEUR,
    to: Token.cREAL,
  },
  rejectSwap: {
    from: Token.CELO,
    to: Token.cREAL,
  },
};

suite({
  name: "Swap - Transaction rejection",
  tags: [TestTag.Regression, TestTag.Sequential],
  beforeEach: async ({ web }) =>
    await web.app.appMento.main.runSwapTestPreconditions(),
  tests: [
    {
      name: `Reject approval tx (${pairs.rejectApproval.from}/${pairs.rejectApproval.to})`,
      testCaseId: "Td5aa1954",
      test: async ({ web }) => {
        const app = web.app.appMento;
        const fromToken = pairs.rejectApproval.from;
        const toToken = pairs.rejectApproval.to;

        await app.swap.fillForm({
          sellAmount: "20",
          tokens: { sell: fromToken, buy: toToken },
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
      name: `Reject swap tx (${pairs.rejectSwap.from}/${pairs.rejectSwap.to})`,
      testCaseId: "T09fd373a",
      test: async ({ web }) => {
        const app = web.app.appMento;
        const fromToken = pairs.rejectSwap.from;
        const toToken = pairs.rejectSwap.to;

        await app.swap.fillForm({
          tokens: { sell: fromToken, buy: toToken },
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
