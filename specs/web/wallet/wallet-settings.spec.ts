import { expect } from "@fixtures/common.fixture";
import { suite } from "@helpers/suite/suite.helper";
import { processEnv } from "@helpers/processEnv/processEnv.helper";

suite({
  name: "Wallet Settings",
  beforeAll: async ({ web, wallet }) => {
    await web.main.openAppWithConnectedWallet(wallet);
  },
  beforeEach: async ({ web }) => {
    await web.main.openWalletSettings();
  },
  afterEach: async ({ web }) => {
    await web.main.browser.refresh();
  },
  tests: [
    {
      name: "Copy address",
      testCaseId: "@T9b6d1b09",
      test: async ({ web }) => {
        await web.main.walletSettingsPopup.copyAddress();
        expect
          .soft(
            await web.main.page.addressCopiedNotificationLabel.isDisplayed(),
          )
          .toBeTruthy();
        expect(await web.main.browser.readFromClipboard()).toEqual(
          processEnv.WALLET_ADDRESS,
        );
      },
    },
    {
      name: "Open network details by 'Change address' button",
      testCaseId: "@T2f5ab8c4",
      test: async ({ web }) => {
        await web.main.walletSettingsPopup.openNetworkDetails();
        expect(
          await web.main.walletSettingsPopup.networkDetails.page.isOpen(),
        ).toBeTruthy();
      },
    },
    {
      name: "Disconnect Wallet",
      testCaseId: "@Tf4dbe31c",
      test: async ({ web }) => {
        await web.main.walletSettingsPopup.disconnect();
        expect(await web.main.isWalletConnected()).toBeFalsy();
      },
    },
  ],
});
