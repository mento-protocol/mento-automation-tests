import { metaMaskFixtures } from "@synthetixio/synpress/playwright";
import { testWithSynpress } from "@synthetixio/synpress";

import basicSetup from "../wallet-setups/basic.setup";
import { MetamaskHelper } from "@helpers/wallet/metamask-wallet.helper";
import { BrowserHelper } from "@helpers/browser/browser.helper";
import { Assembler, IApi, IWeb } from "@helpers/assembler/assember";
import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { HttpClient } from "@shared/api/http/http-client";
import { ContractHelper } from "@helpers/contract/contract.helper";

const synpressFixture = testWithSynpress(metaMaskFixtures(basicSetup));

export const testFixture = synpressFixture.extend<IApplicationFixtures>({
  metamaskHelper: async ({ metamask }, use) => {
    const metamaskHelper = new MetamaskHelper(metamask);
    await use(metamaskHelper);
  },

  // @ts-ignore
  // eslint-disable-next-line
  contractHelper: async ({}, use) => {
    const contractHelper = new ContractHelper();
    await use(contractHelper);
  },

  web: async ({ context, page, metamaskHelper, contractHelper }, use) => {
    const assembler = new Assembler({
      browserHelper: new BrowserHelper({ pwPage: page, pwContext: context }),
      elementFinder: new ElementFinderHelper({ page }),
      metamaskHelper,
      contractHelper,
    });
    const web = await assembler.web();
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await web.browser.collectErrors();
    await web.browser.attachErrors();
    await use(web);
  },

  api: async ({ request }, use) => {
    const assembler = new Assembler({ httpClient: new HttpClient(request) });
    const api = await assembler.api();
    await use(api);
  },
});

export { expect } from "@playwright/test";

export interface IApplicationFixtures {
  web: IWeb;
  api: IApi;
  metamaskHelper: MetamaskHelper;
  contractHelper: ContractHelper;
}
