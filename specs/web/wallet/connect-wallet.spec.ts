import { expect } from "@fixtures/common.fixture";
import { suite } from "@helpers/suite/suite.helper";
import { WalletName } from "@services/connect-wallet-modal.service";

suite({
  name: "Connect Wallet",
  beforeAll: async ({ web }) => {
    await web.main.navigateToApp();
  },
  tests: [
    {
      name: "Connect the Metamask wallet",
      testCaseId: "@Tf302ddd6",
      test: async ({ web, wallet }) => {
        await web.main.connectWalletByName(wallet, WalletName.Metamask);
        expect(await web.main.isWalletConnected()).toBeTruthy();
      },
    },
  ],
});
