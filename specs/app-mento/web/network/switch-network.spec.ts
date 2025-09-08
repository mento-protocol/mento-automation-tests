import { TestTag } from "@constants/test.constants";
import { expect } from "@fixtures/test.fixture";
import { envHelper } from "@helpers/env/env.helper";
import { suite } from "@helpers/suite/suite.helper";
import { IExecution } from "@helpers/suite/suite.types";
import { Network } from "../../../../src/apps/app-mento/web/settings/switch-networks.page";
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
    await app.main.openSwitchNetwork();
  },
  tests: [
    {
      name: "Reject switch network",
      testCaseId: "Tbf3f639c",
      test: async ({ web }) => {
        const app = web.app.appMento;
        const initialNetworkName = await app.main.settings.getCurrentNetwork();

        await app.main.settings.rejectSwitchNetwork(networkNameToSwitch);
        await app.main.openSwitchNetwork();
        expect(await app.main.settings.getCurrentNetwork()).toEqual(
          initialNetworkName,
        );
      },
    },
    {
      name: `Switch network to ${networkNameToSwitch}`,
      testCaseId: "T97490a07",
      test: async ({ web }: IExecution) => {
        const app = web.app.appMento;

        await app.main.settings.switchNetwork(networkNameToSwitch);
        await app.main.openSwitchNetwork();
        expect(await app.main.settings.getCurrentNetwork()).toEqual(
          networkNameToSwitch,
        );
      },
    },
  ],
});
