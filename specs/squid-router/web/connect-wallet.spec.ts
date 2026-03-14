import { TestTag } from "@constants/test.constants";
import { expect } from "@fixtures/test.fixture";
import { testHelper } from "@helpers/test/test.helper";
import { WalletName } from "@shared/web/connect-wallet-modal/connect-wallet-modal.service";

testHelper.runSuite({
  name: "Connect Wallet",
  tags: [TestTag.Regression],
  tests: [
    {
      name: "Connect Metamask wallet",
      testCaseId: "Tf302ddd6",
      test: async ({ web }) => {
        const app = web.app.squidRouter;

        await app.main.connectWalletByName(WalletName.Metamask);
        expect(await app.main.isWalletConnected()).toBeTruthy();
      },
    },
  ],
});
