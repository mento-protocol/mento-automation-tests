import { TestTag } from "@constants/test.constants";
import { expect } from "@fixtures/common/common.fixture";
import { suite } from "@helpers/suite/suite.helper";
import { WalletName } from "@services/connect-wallet-modal/connect-wallet-modal.service.types";

suite({
  name: "Wallet Settings",
  tags: [TestTag.Regression, TestTag.Parallel],
  beforeEach: async ({ web }) => {
    await web.main.connectWalletByName(WalletName.Metamask);
    await web.main.openWalletSettings();
  },
  tests: [
    {
      name: "Copy address",
      testCaseId: "T9b6d1b09",
      test: async ({ web, metamaskHelper }) => {
        await web.main.walletSettingsPopup.copyAddress();
        expect
          .soft(
            await web.main.page.addressCopiedNotificationLabel.isDisplayed(),
          )
          .toBeTruthy();
        expect(await web.main.browser.readFromClipboard()).toEqual(
          await metamaskHelper.getAddress(),
        );
      },
    },
    {
      name: "Open network details by 'Change address' button",
      testCaseId: "T2f5ab8c4",
      test: async ({ web }) => {
        await web.main.walletSettingsPopup.openNetworkDetails();
        expect(
          await web.main.walletSettingsPopup.networkDetails.page.isOpen(),
        ).toBeTruthy();
      },
    },
    {
      name: "Disconnect Wallet",
      testCaseId: "Tf4dbe31c",
      test: async ({ web }) => {
        await web.main.walletSettingsPopup.disconnect();
        expect(await web.main.isWalletConnected()).toBeFalsy();
      },
    },
  ],
});
