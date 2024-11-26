import { expect } from "@fixtures/common.fixture";
import { suite } from "@helpers/suite/suite.helper";

suite({
  name: "Wallet modal",
  beforeAll: async ({ web }) => {
    await web.main.navigateToApp();
  },
  tests: [
    {
      name: "Open from header button",
      testCaseId: "",
      test: async ({ web }) => {
        await web.main.openConnectWalletModalFromHeader();
        expect(await web.main.connectWallet.page.isOpen()).toBeTruthy();
      },
    },
    {
      name: "Open from main button",
      testCaseId: "",
      test: async ({ web }) => {
        await web.main.openConnectWalletModal();
        expect(await web.main.connectWallet.page.isOpen()).toBeTruthy();
      },
    },
  ],
});
