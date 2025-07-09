import { TestTag } from "@constants/test.constants";
import { expect } from "@fixtures/test.fixture";
import { envHelper } from "@helpers/env/env.helper";
import { suite } from "@helpers/suite/suite.helper";
import { IExecution } from "@helpers/suite/suite.types";
import { Network } from "../../../../src/apps/app-mento/web/network-modal/network-modal.service";
import { WalletName } from "../../../../src/apps/shared/web/connect-wallet-modal/connect-wallet-modal.service";

const networkNameToSwitch = envHelper.isMainnet()
  ? Network.Alfajores
  : Network.Celo;

suite({
  name: "Switch network",
  tags: [TestTag.Regression, TestTag.Sequential],
  beforeEach: async ({ web }) => {
    const app = web.app.appMento;
    await app.main.connectWalletByName(WalletName.Metamask);
    await app.main.openNetworkDetails();
  },
  afterEach: async ({ web }) => await web.browser.refresh(),
  tests: [
    {
      name: "Reject switch network",
      disable: {
        reason: "Fix the flaky 'Switch network' test suite",
        link: "https://linear.app/mento-labs/issue/AUT-19/",
      },
      testCaseId: "Tbf3f639c",
      test: async ({ web, metamaskHelper }) => {
        const app = web.app.appMento;
        const initialNetworkName =
          await app.main.walletSettingsPopup.networkDetails.getCurrentNetwork();
        await app.main.walletSettingsPopup.networkDetails.page.networkButtons[
          networkNameToSwitch
        ].click();
        await metamaskHelper.approveNewNetwork();
        await metamaskHelper.rejectSwitchNetwork();
        expect(
          await app.main.page.failedSwitchNetworkNotificationLabel.isDisplayed(),
        ).toBeTruthy();
        expect(
          await app.main.walletSettingsPopup.networkDetails.getCurrentNetwork(),
        ).toEqual(initialNetworkName);
      },
    },
    {
      name: `Switch network to ${networkNameToSwitch}`,
      testCaseId: "T97490a07",
      disable: {
        reason: "Fix the flaky 'Switch network' test suite",
        link: "https://linear.app/mento-labs/issue/AUT-19/",
      },
      test: async ({ web }: IExecution) => {
        const app = web.app.appMento;
        const intialNetworkName =
          await app.main.walletSettingsPopup.networkDetails.getCurrentNetwork();
        await app.main.walletSettingsPopup.networkDetails.switchToNetworkByName(
          networkNameToSwitch,
        );
        expect(
          await app.main.page.failedSwitchNetworkNotificationLabel.isDisplayed(),
        ).toBeFalsy();
        await app.main.walletSettingsPopup.networkDetails.waitForNetworkToChange(
          intialNetworkName,
        );
        expect(
          await app.main.walletSettingsPopup.networkDetails.getCurrentNetwork(),
        ).toEqual(networkNameToSwitch);
      },
    },
  ],
});
