import { expect } from "@fixtures/common/common.fixture";
import { suite } from "@helpers/suite/suite.helper";
import { IExecution } from "@helpers/suite/suite.types";
import { Network, WalletName } from "@services/index";

const testCases = [
  {
    network: Network.Baklava,
    id: "@T5eb11e48",
    disable: {
      reason:
        "[Mento-Web] Can't click any button from the down side of application due to overlapping by image",
      link: "https://linear.app/mento-labs/issue/SUP-158",
    },
  },
  {
    network: Network.Alfajores,
    id: "@T97490a07",
    disable: {
      reason:
        "[Mento-Web] Can't click any button from the down side of application due to overlapping by image",
      link: "https://linear.app/mento-labs/issue/SUP-158",
    },
    // disable: { reason: "Initially set as default for tests" },
  },
  {
    network: Network.Celo,
    id: "@T3130e821",
    disable: {
      reason:
        "[Mento-Web] Can't click any button from the down side of application due to overlapping by image",
      link: "https://linear.app/mento-labs/issue/SUP-158",
    },
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
      name: "Reject switch network transaction",
      disable: {
        reason:
          "[Mento-Web] Can't click any button from the down side of application due to overlapping by image",
        link: "https://linear.app/mento-labs/issue/SUP-158",
      },
      testCaseId: "@Tbf3f639c",
      test: async ({ web, metamaskHelper }) => {
        await web.main.walletSettingsPopup.networkDetails.switchNetworkByName(
          Network.Baklava,
        );
        await metamaskHelper.rejectSwitchNetwork();
        expect
          .soft(
            await web.main.page.failedSwitchNetworkNotificationLabel.isDisplayed(),
          )
          .toBeTruthy();
        // todo: Enable when new locators are merged into main
        // expect(await web.main.networkDetails.getCurrentNetwork()).toEqual(
        //   Network.Alfajores,
        // );
      },
    },
    ...testCases.map(testCase => {
      return {
        name: `Switch to the '${testCase.network}' network`,
        testCaseId: testCase.id,
        disable: testCase?.disable,
        test: async ({ web, metamaskHelper }: IExecution) => {
          await web.main.walletSettingsPopup.networkDetails.switchNetworkByName(
            testCase.network,
          );
          await metamaskHelper.approveSwitchNetwork();
          expect
            .soft(
              await web.main.page.failedSwitchNetworkNotificationLabel.isDisplayed(),
            )
            .toBeFalsy();
          // todo: Enable when new locators are merged into main
          // expect(await web.main.networkDetails.getCurrentNetwork()).toEqual(
          //   testCase.network,
          // );
        },
      };
    }),
  ],
});
