import { expect } from "@fixtures/common.fixture";
import { suite } from "@helpers/suite/suite.helper";

suite({
  name: "Wallet modal",
  beforeAll: async ({ web }) => {
    await web.main.navigateToApp();
  },
  beforeEach: async ({ web }) => {
    await web.main.browser.refresh();
  },
  tests: [
    {
      name: "Open by header button",
      testCaseId: "@T112a63d0",
      test: async ({ web }) => {
        await web.main.openConnectWalletModalFromHeader();
        expect(await web.main.connectWalletModal.page.isOpen()).toBeTruthy();
      },
    },
    {
      name: "Open by main button",
      testCaseId: "@T224b25fc",
      test: async ({ web }) => {
        await web.main.openConnectWalletModal();
        expect(await web.main.connectWalletModal.page.isOpen()).toBeTruthy();
      },
    },
    {
      name: "Close by clicking its button",
      testCaseId: "@T2836c736",
      test: async ({ web }) => {
        await web.main.openConnectWalletModal();
        await web.main.connectWalletModal.page.verifyIsOpen();
        await web.main.connectWalletModal.close();
        expect
          .soft(await web.main.connectWalletModal.page.isOpen())
          .toBeFalsy();
        expect(await web.main.page.isOpen()).toBeTruthy();
      },
    },
  ],
});
