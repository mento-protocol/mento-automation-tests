import { expect } from "@fixtures/common/common.fixture";
import { suite } from "@helpers/suite/suite.helper";
import { IExecution } from "@helpers/suite/suite.types";
import { Network, WalletName } from "@services/index";

const testCases = [
  {
    network: Network.Alfajores,
    id: "@T97490a07",
  },
  {
    network: Network.Celo,
    id: "@T3130e821",
    disable: { reason: "Initially set as default for parallel tests" },
  },
];

suite({
  name: "Switch network",
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
      testCaseId: "@Tbf3f639c",
      test: async ({ web, metamaskHelper }) => {
        await web.main.walletSettingsPopup.networkDetails.page.networkButtons[
          Network.Celo
        ].click();
        await metamaskHelper.rejectSwitchNetwork();
        expect(
          await web.main.page.failedSwitchNetworkNotificationLabel.isDisplayed(),
        ).toBeTruthy();
        expect(
          await web.main.walletSettingsPopup.networkDetails.getCurrentNetwork(),
        ).toEqual(Network.Alfajores);
      },
    },
    ...testCases.map(testCase => {
      return {
        name: `Switch to the '${testCase.network}' network`,
        testCaseId: testCase.id,
        disable: testCase?.disable,
        test: async ({ web }: IExecution) => {
          await web.main.walletSettingsPopup.networkDetails.switchNetworkByName(
            testCase.network,
          );
          expect(
            await web.main.page.failedSwitchNetworkNotificationLabel.isDisplayed(),
          ).toBeFalsy();
          await web.main.walletSettingsPopup.networkDetails.waitForNetworkToChange(
            Network.Alfajores,
          );
          expect(
            await web.main.walletSettingsPopup.networkDetails.getCurrentNetwork(),
          ).toEqual(testCase.network);
        },
      };
    }),
  ],
});
