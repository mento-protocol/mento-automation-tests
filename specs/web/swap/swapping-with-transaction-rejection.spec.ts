import { expect } from "@fixtures/common/common.fixture";
import { defaultSwapAmount, Token } from "@constants/token.constants";
import { suite } from "@helpers/suite/suite.helper";

suite({
  name: "Swap - Transaction rejection",
  beforeAll: async ({ web, wallet }) => {
    await web.main.openAppWithConnectedWallet(wallet);
  },
  afterEach: async ({ web }) => {
    await web.swap.browser.refresh();
  },
  tests: [
    {
      name: "Reject approval transaction",
      testCaseId: "@Td5aa1954",
      test: async ({ web, wallet }) => {
        await web.swap.fillForm({
          tokens: { from: Token.cREAL, to: Token.CELO },
          fromAmount: defaultSwapAmount,
        });
        await web.swap.start();
        await wallet.metamask.reject();
        expect(
          await web.swap.confirm.isRejectApprovalTransactionNotificationThere(),
        ).toBeTruthy();
      },
    },
    {
      name: "Reject swap transaction",
      testCaseId: "@T09fd373a",
      test: async ({ web, wallet }) => {
        await web.swap.fillForm({
          tokens: { from: Token.CELO, to: Token.cEUR },
          fromAmount: defaultSwapAmount,
        });
        await web.swap.start();
        await wallet.helper.rejectSwapTransaction();
        expect(
          await web.swap.confirm.isRejectSwapTransactionNotificationThere(),
        ).toBeTruthy();
      },
    },
  ],
});
