import { TestTag } from "@constants/test.constants";
import { expect } from "@fixtures/test.fixture";
import { suite } from "@helpers/suite/suite.helper";
import { timeouts } from "@constants/timeouts.constants";
import { governanceContractAddresses } from "@constants/governanceUrl.constants";
import { Chain, envHelper } from "@helpers/env/env.helper";
import { IExecution } from "@helpers/suite/suite.types";
import { WalletName } from "@shared/web/connect-wallet-modal/connect-wallet-modal.service";

const testCases = [
  { name: "governor" },
  { name: "mento" },
  { name: "timelock" },
  { name: "veMento" },
];
const chainName =
  envHelper.getChain() === Chain.Mainnet ? "Celo Mainnet" : "Alfajores Testnet";

suite({
  name: "Verify contract links",
  tags: [TestTag.Regression, TestTag.Parallel, TestTag.Smoke],
  tests: [
    ...testCases.map(testCase => ({
      name: `'${testCase.name}' link match to the Celo Mainnet when a wallet is disconnected`,
      testCaseId: "",
      test: async ({ web }: IExecution) => {
        const app = web.app.governance;

        await app.main.openContractAddressesSection();
        const newTabPage = await app.main.browser.getNewTabPage({
          navigateCallback: async () => {
            await app.main.page.contractAddresseLinkButtons[
              testCase.name
            ].click();
          },
          waitTimeout: timeouts.xxxs,
        });

        expect(newTabPage.url()).toBe(
          governanceContractAddresses[Chain.Mainnet][testCase.name],
        );
      },
    })),
    ...testCases.map(testCase => ({
      name: `'${testCase.name}' link match to the ${chainName} when a wallet is connected and selected corresponding network in wallet`,
      testCaseId: "",
      test: async ({ web }: IExecution) => {
        const app = web.app.governance;

        await app.main.connectWalletByName(WalletName.Metamask);
        await app.main.openContractAddressesSection();
        const newTabPage = await app.main.browser.getNewTabPage({
          navigateCallback: async () => {
            await app.main.page.contractAddresseLinkButtons[
              testCase.name
            ].click();
          },
          waitTimeout: timeouts.xxxs,
        });

        expect(newTabPage.url()).toBe(
          governanceContractAddresses[envHelper.getChain()][testCase.name],
        );
      },
    })),
  ],
});
