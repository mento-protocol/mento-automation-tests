import { expect } from "@fixtures/common/common.fixture";
import { defaultSwapAmount, Token } from "@constants/token.constants";
import { suite } from "@helpers/suite/suite.helper";

suite({
  name: "Swap - Transaction rejection",
  beforeEach: async ({ web }) => {
    await web.main.runSwapTestPreconditions();
  },
  tests: [
    {
      name: "Reject approval tx",
      testCaseId: "@Td5aa1954",
      test: async ({ web }) => {
        await web.swap.fillForm({
          tokens: { from: Token.CELO, to: Token.cKES },
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
      name: "Reject swap tx",
      testCaseId: "@T09fd373a",
      test: async ({ web }) => {
        await web.swap.fillForm({
          tokens: { from: Token.CELO, to: Token.cREAL },
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
