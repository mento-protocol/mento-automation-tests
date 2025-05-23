import { expect } from "@fixtures/common/common.fixture";
import { defaultSwapAmount, Token } from "@constants/token.constants";
import { suite } from "@helpers/suite/suite.helper";

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
  beforeEach: async ({ web }) => {
    await web.main.runSwapTestPreconditions();
  },
  tests: [
    {
      name: `Reject approval tx (${pairs.rejectApproval.from}/${pairs.rejectApproval.to})`,
      testCaseId: "@Td5aa1954",
      test: async ({ web }) => {
        await web.swap.fillForm({
          tokens: {
            from: pairs.rejectApproval.from,
            to: pairs.rejectApproval.to,
          },
          fromAmount: defaultSwapAmount,
        });
        await web.swap.start();
        await web.swap.confirm.rejectByType("approval");
        expect(
          await web.swap.confirm.isRejectApprovalTxNotificationThere(),
        ).toBeTruthy();
      },
    },
    {
      name: `Reject swap tx (${pairs.rejectSwap.from}/${pairs.rejectSwap.to})`,
      testCaseId: "@T09fd373a",
      test: async ({ web }) => {
        await web.swap.fillForm({
          tokens: {
            from: pairs.rejectSwap.from,
            to: pairs.rejectSwap.to,
          },
          fromAmount: defaultSwapAmount,
        });
        await web.swap.start();
        await web.swap.confirm.rejectByType("swap");
        expect(
          await web.swap.confirm.isRejectSwapTxNotificationThere(),
        ).toBeTruthy();
      },
    },
  ],
});
