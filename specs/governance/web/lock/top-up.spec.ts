import { TestTag } from "@constants/test.constants";
import { suite } from "@helpers/suite/suite.helper";
import { WalletName } from "@shared/web/connect-wallet-modal/connect-wallet-modal.service";
import { timeouts } from "@constants/index";

suite({
  name: "Lock - Top-up",
  tags: [TestTag.Regression, TestTag.Sequential, TestTag.Smoke],
  beforeEach: async ({ web }) => {
    await web.app.governance.main.connectWalletByName(WalletName.Metamask);
  },
  tests: [
    {
      name: "Top-up successfully",
      testCaseId: "",
      test: async ({ web }) => {
        const app = web.app.governance;

        await app.main.openVotingPowerPage();
        // TODO: Sort out with entering amount
        await app.votingPower.enterAmount("100");
        await app.votingPower.page.topUpLockButton.waitUntilDisplayed(
          timeouts.s,
          {
            errorMessage: "Top-up lock button is not displayed!",
          },
        );
        await app.votingPower.page.topUpLockButton.click();
        await app.votingPower.page.topUpLockPopupDescriptionLabel.waitUntilDisplayed(
          timeouts.s,
          {
            errorMessage: "Top-up lock popup title label is not displayed!",
          },
        );
      },
    },
  ],
});
