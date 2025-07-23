import { TestTag } from "@constants/test.constants";
import { suite } from "@helpers/suite/suite.helper";
import { WalletName } from "@shared/web/connect-wallet-modal/connect-wallet-modal.service";
import { expect } from "@fixtures/test.fixture";

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

        const { veMento: initialVeMento, mento: initialMento } =
          await app.votingPower.getCurrentLockValues();

        await app.votingPower.topUpLock("10");
        await app.votingPower.waitForLockValuesToChange({
          initialVeMento,
          initialMento,
        });

        const { veMento: currentVeMento, mento: currentMento } =
          await app.votingPower.getCurrentLockValues();

        expect.soft(currentVeMento).toBeGreaterThan(initialVeMento);
        expect.soft(currentMento).toBeGreaterThan(initialMento);
      },
    },
  ],
});
