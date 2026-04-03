import { TestTag } from "@constants/test.constants";
import { expect } from "@fixtures/test.fixture";
import { ChainType, envHelper } from "@helpers/env/env.helper";
import { testHelper } from "@helpers/test/test.helper";
import { IExecution } from "@helpers/test/test.types";
import { WalletName } from "../../../../src/apps/shared/web/connect-wallet-modal/connect-wallet-modal.service";

const chainToSwitch = envHelper.getChainToSwitch();

testHelper.runSuite({
  name: "Switch network",
  tags: [TestTag.Regression, TestTag.Sequential],
  beforeEach: async ({ web }) => {
    const app = web.app.appMento;
    await app.main.connectWalletByName(WalletName.Metamask);
  },
  tests: [
    {
      name: `Switch to ${chainToSwitch.name} (${chainToSwitch.type})`,
      testCaseId: "T97490a07",
      test: async ({ web }: IExecution) => {
        const app = web.app.appMento;
        await app.main.waitForNetwork({
          chainName: envHelper.getChainName(),
          throwError: true,
        });
        await app.main.switchNetwork({
          networkName: chainToSwitch.name,
          shouldEnableTestnetMode: chainToSwitch.type === ChainType.Testnet,
        });
        await app.main.waitForNetwork({
          chainName: chainToSwitch.name,
          throwError: false,
        });
        expect(await app.main.getCurrentChainName()).toEqual(
          chainToSwitch.name,
        );
      },
    },
  ],
});
