import { TestTag } from "@constants/test.constants";
import { expect } from "@fixtures/common/common.fixture";
import { suite } from "@helpers/suite/suite.helper";
import { WalletName } from "../../../../src/apps/shared/web/connect-wallet-modal/connect-wallet-modal.service";

suite({
  name: "Connect Wallet",
  tags: [TestTag.Regression, TestTag.Parallel, TestTag.Smoke],
  tests: [
    {
      name: "Connect Metamask wallet",
      testCaseId: "TODO: Add test case and paste an id",
      test: async ({ web }) => {
        await web.main.connectWalletByName(WalletName.Metamask);
        expect(await web.main.isWalletConnected()).toBeTruthy();
      },
    },
  ],
});
