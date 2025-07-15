import { TestTag } from "@constants/test.constants";
import { expect } from "@fixtures/test.fixture";
import { suite } from "@helpers/suite/suite.helper";
import { WalletName } from "../../../../src/apps/shared/web/connect-wallet-modal/connect-wallet-modal.service";

suite({
  name: "Connect Wallet",
  tags: [TestTag.Regression, TestTag.Parallel, TestTag.Smoke],
  tests: [
    {
      name: "Connect Metamask wallet",
      testCaseId: "@T1eb92bd5",
      test: async ({ web }) => {
        const app = web.app.governance.main;
        await app.connectWalletByName(WalletName.Metamask);
        expect(await app.isWalletConnected()).toBeTruthy();
      },
    },
  ],
});
