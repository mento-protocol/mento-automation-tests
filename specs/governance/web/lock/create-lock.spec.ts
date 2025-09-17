import { TestTag } from "@constants/test.constants";
import { suite } from "@helpers/suite/suite.helper";
import { WalletName } from "@shared/web/connect-wallet-modal/connect-wallet-modal.service";
import { expect } from "@fixtures/test.fixture";

suite({
  name: "Lock - Create",
  tags: [TestTag.Regression, TestTag.Sequential, TestTag.Smoke],
  beforeEach: async ({ web }) => {
    await web.app.governance.main.connectWalletByName(WalletName.Metamask);
  },
  tests: [
    {
      name: "Create lock successfully",
      testCaseId: "",
      test: async ({ web }) => {
        const app = web.app.governance;

        await app.main.openVotingPowerPage();
        await app.votingPower.waitForLockValues();

        const { veMento: initialVeMento, mento: initialMento } =
          await app.votingPower.getCurrentLockValues();

        await app.votingPower.createLock({ lockAmount: "2" });
        await app.votingPower.waitForLockValuesToChange({
          initialVeMento,
          initialMento,
        });

        const { veMento: currentVeMento } =
          await app.votingPower.getCurrentLockValues();

        expect.soft(currentVeMento).toBeGreaterThan(initialVeMento);
        // TODO: Turn on once the bug is fixed https://vercel.live/link/governance.mento.org?page=%2Fvoting-power%3FvercelThreadId%3D3stKN&via=in-app-copy-link&p=1
        // expect(currentMento).toBeGreaterThan(initialMento);
      },
    },
  ],
});
