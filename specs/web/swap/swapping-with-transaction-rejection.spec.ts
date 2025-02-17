import { expect } from "@fixtures/common/common.fixture";
import { defaultSwapAmount, Token } from "@constants/token.constants";
import { suite } from "@helpers/suite/suite.helper";
import { Network, WalletName } from "@services/index";
import { timeouts } from "@constants/timeouts.constants";

suite({
  name: "Swap - Transaction rejection",
  beforeEach: async ({ web }) => {
    await web.main.connectWalletByName(WalletName.Metamask);
    await web.main.switchNetwork({
      networkName: Network.Alfajores,
      shouldOpenSettings: true,
    });
    await web.main.waitForBalanceToLoad({ shouldCloseSettings: true });
  },
  tests: [
    {
      name: "Reject approval transaction",
      testCaseId: "@Td5aa1954",
      test: async ({ web, metamaskHelper }) => {
        await web.swap.fillForm({
          tokens: { from: Token.cREAL, to: Token.CELO },
          fromAmount: defaultSwapAmount,
        });
        await web.swap.start();
        await metamaskHelper.rejectTransaction();
        expect(
          await web.swap.confirm.isRejectApprovalTransactionNotificationThere(),
        ).toBeTruthy();
      },
    },
    {
      name: "Reject swap transaction",
      testCaseId: "@T09fd373a",
      test: async ({ web, metamaskHelper }) => {
        await web.swap.fillForm({
          tokens: { from: Token.CELO, to: Token.cREAL },
          fromAmount: defaultSwapAmount,
        });
        await web.swap.start();
        await metamaskHelper.confirmTransaction();
        await web.swap.confirm.page.approveCompleteNotificationLabel.waitUntilDisplayed(
          timeouts.xl,
        );
        await metamaskHelper.rejectTransaction();
        expect(
          await web.swap.confirm.isRejectSwapTransactionNotificationThere(),
        ).toBeTruthy();
      },
    },
  ],
});
