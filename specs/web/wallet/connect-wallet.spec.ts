import { expect } from "@fixtures/common/common.fixture";
import { suite } from "@helpers/suite/suite.helper";
import { WalletName } from "@services/index";

suite({
  name: "Connect Wallet",
  beforeAll: async ({ web }) => {
    await web.main.navigateToApp();
  },
  tests: [
    {
      name: "Connect Metamask wallet",
      testCaseId: "@Tf302ddd6",
      test: async ({ web, wallet }) => {
        await web.main.connectWalletByName(wallet, WalletName.Metamask);
        expect(await web.main.isWalletConnected()).toBeTruthy();
      },
    },
  ],
});
