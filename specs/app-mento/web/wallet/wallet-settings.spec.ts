import { TestTag } from "@constants/test.constants";
import { expect } from "@fixtures/test.fixture";
import { testHelper } from "@helpers/test/test.helper";
import { WalletName } from "../../../../src/apps/shared/web/connect-wallet-modal/connect-wallet-modal.service";

testHelper.runSuite({
  name: "Wallet Settings",
  tags: [TestTag.Regression, TestTag.Parallel],
  beforeEach: async ({ web }) => {
    const app = web.app.appMento;
    await app.main.connectWalletByName(WalletName.Metamask);
    await app.main.openSettings();
  },
  tests: [
    {
      name: "Copy address",
      testCaseId: "T9b6d1b09",
      test: async ({ web, metamaskHelper }) => {
        const app = web.app.appMento;
        await app.main.settings.copyAddress();
        expect
          .soft(
            await app.main.page.addressCopiedNotificationLabel.isDisplayed(),
          )
          .toBeTruthy();
        expect(await app.main.browser.readFromClipboard()).toEqual(
          await metamaskHelper.getAddress(),
        );
      },
    },
    {
      name: "Open switch network modal",
      testCaseId: "T2f5ab8c4",
      test: async ({ web }) => {
        const app = web.app.appMento;
        await app.main.settings.openSwitchNetworkDialog();
        expect(
          await app.main.settings.switchNetworksPage.isOpen(),
        ).toBeTruthy();
      },
    },
    {
      name: "Disconnect Wallet",
      testCaseId: "Tf4dbe31c",
      test: async ({ web }) => {
        const app = web.app.appMento;
        await app.main.settings.disconnect();
        expect(await app.main.isWalletConnected()).toBeFalsy();
      },
    },
  ],
});
