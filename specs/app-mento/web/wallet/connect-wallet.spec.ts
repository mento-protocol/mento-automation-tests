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
      testCaseId: "Tf302ddd6",
      test: async ({ web }) => {
        await web.app.appMento.main.connectWalletByName(WalletName.Metamask);
        expect(await web.app.appMento.main.isWalletConnected()).toBeTruthy();
      },
    },
  ],
});
