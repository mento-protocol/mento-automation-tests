import { expect } from "@fixtures/common/common.fixture";
import { suite } from "@helpers/suite/suite.helper";
import { IExecution } from "@helpers/suite/suite.types";
import { Network } from "@services/index";

const testCases = [
  { network: Network.Baklava, id: "@T5eb11e48" },
  {
    network: Network.Alfajores,
    id: "@T97490a07",
    disable: { reason: "Initially set as default for tests" },
  },
  { network: Network.Celo, id: "@T3130e821" },
];

suite({
  name: "Switch network",
  beforeAll: async ({ web, wallet }) => {
    await web.main.openAppWithConnectedWallet(wallet);
  },
  afterEach: async ({ web }) => {
    await web.main.browser.refresh();
  },
  beforeEach: async ({ web }) => {
    await web.main.openNetworkDetails();
  },
  tests: [
    {
      name: "Reject switch network transaction",
      testCaseId: "@Tbf3f639c",
      test: async ({ web, wallet }) => {
        await web.main.walletSettingsPopup.networkDetails.switchNetworkByName(
          Network.Baklava,
        );
        await wallet.helper.rejectNetworkSwitch();
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
        test: async ({ web, wallet }: IExecution) => {
          await web.main.walletSettingsPopup.networkDetails.switchNetworkByName(
            testCase.network,
          );
          await wallet.helper.confirmNetworkSwitch();
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
