import { TestTag } from "@constants/test.constants";
import { expect } from "@fixtures/common/common.fixture";
import { envHelper } from "@helpers/env/env.helper";
import { suite } from "@helpers/suite/suite.helper";
import { IExecution } from "@helpers/suite/suite.types";
import { Network, WalletName } from "@services/index";

const networkNameToSwitch = envHelper.isMainnet()
  ? Network.Alfajores
  : Network.Celo;

suite({
  name: "Switch network",
  tags: [TestTag.Regression, TestTag.Sequential],
  beforeEach: async ({ web }) => {
    await web.main.connectWalletByName(WalletName.Metamask);
    await web.main.openNetworkDetails();
  },
  afterEach: async ({ web }) => {
    await web.main.browser.refresh();
  },

  tests: [
    {
      name: "Reject switch network",
      disable: {
        reason: "Fix the flaky 'Switch network' test suite",
        link: "https://linear.app/mento-labs/issue/AUT-19/",
      },
      testCaseId: "Tbf3f639c",
      test: async ({ web, metamaskHelper }) => {
        const initialNetworkName =
          await web.main.walletSettingsPopup.networkDetails.getCurrentNetwork();
        await web.main.walletSettingsPopup.networkDetails.page.networkButtons[
          networkNameToSwitch
        ].click();
        await metamaskHelper.approveNewNetwork();
        await metamaskHelper.rejectSwitchNetwork();
        expect(
          await web.main.page.failedSwitchNetworkNotificationLabel.isDisplayed(),
        ).toBeTruthy();
        expect(
          await web.main.walletSettingsPopup.networkDetails.getCurrentNetwork(),
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
        const intialNetworkName =
          await web.main.walletSettingsPopup.networkDetails.getCurrentNetwork();
        await web.main.walletSettingsPopup.networkDetails.switchToNetworkByName(
          networkNameToSwitch,
        );
        expect(
          await web.main.page.failedSwitchNetworkNotificationLabel.isDisplayed(),
        ).toBeFalsy();
        await web.main.walletSettingsPopup.networkDetails.waitForNetworkToChange(
          intialNetworkName,
        );
        expect(
          await web.main.walletSettingsPopup.networkDetails.getCurrentNetwork(),
        ).toEqual(networkNameToSwitch);
      },
    },
  ],
});
