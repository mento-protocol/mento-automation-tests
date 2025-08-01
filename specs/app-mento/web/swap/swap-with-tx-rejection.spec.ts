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
        await app.swap.fillForm({
          tokens: {
            sell: pairs.rejectApproval.from,
            buy: pairs.rejectApproval.to,
          },
          sellAmount: "30",
        });
        await app.swap.page.approveButton.click();
        await app.swap.confirm.rejectByType("approval");
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
        await app.swap.fillForm({
          tokens: {
            sell: pairs.rejectSwap.from,
            buy: pairs.rejectSwap.to,
          },
          sellAmount: defaultSwapAmount,
        });
        await app.swap.proceedToConfirmation();
        await app.swap.confirm.page.verifyIsOpen();
        await app.swap.confirm.page.swapButton.click();
        await app.swap.confirm.rejectByType("swap");
        expect(
          await app.swap.confirm.isRejectSwapTxNotificationThere(),
        ).toBeTruthy();
      },
    },
  ],
});
