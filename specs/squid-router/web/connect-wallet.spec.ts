import { TestTag } from "@constants/test.constants";
import { expect } from "@fixtures/test.fixture";
import { suite } from "@helpers/suite/suite.helper";
import { WalletName } from "@shared/web/connect-wallet-modal/connect-wallet-modal.service";

suite({
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
