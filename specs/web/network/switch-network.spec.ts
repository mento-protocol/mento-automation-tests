import { expect } from "@fixtures/common.fixture";
import { suite } from "@helpers/suite/suite.helper";
import { Network } from "@services/network-details-modal.service";
import { IExecution } from "@helpers/suite/suite.types";

const testCases = [
  { network: Network.Celo, id: "" },
  { network: Network.Alfajores, id: "" },
  { network: Network.Baklava, id: "" },
];

suite({
  name: "Change network",
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
      testCaseId: "",
      test: async ({ web, wallet }) => {
        await web.main.walletSettingsPopup.networkDetails.switchNetworkByName(
          Network.Baklava,
        );
        await wallet.metamask.reject();
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
        name: `Change to the '${testCase.network}' network`,
        testCaseId: testCase.id,
        test: async ({ web, wallet }: IExecution) => {
          await web.main.walletSettingsPopup.networkDetails.switchNetworkByName(
            testCase.network,
          );
          await wallet.metamask.approve();
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
