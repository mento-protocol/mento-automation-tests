import { metaMaskFixtures } from "@synthetixio/synpress/playwright";
import { testWithSynpress } from "@synthetixio/synpress";

import basicSetup from "../wallet-setups/basic.setup";
import { MetamaskHelper } from "@helpers/wallet/metamask-wallet.helper";
import { BrowserHelper } from "@helpers/browser/browser.helper";
import {
  AssemblerHelper,
  IApi,
  IWeb,
} from "@helpers/assembler/assembler.helper";
import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { HttpClient } from "@helpers/api/http/http-client";
import { ContractHelper } from "@helpers/contract/contract.helper";
import { GraphQLClient } from "@helpers/api/graphql/graphql.client";

const synpressFixture = testWithSynpress(metaMaskFixtures(basicSetup));

export const testFixture = synpressFixture.extend<IApplicationFixtures>({
  metamaskHelper: async ({ metamask }, use) => {
    const metamaskHelper = new MetamaskHelper(metamask);
    await use(metamaskHelper);
  },

  contractHelper: async ({}, use) => {
    const contractHelper = new ContractHelper();
    await use(contractHelper);
  },

  web: async ({ context, page, metamaskHelper, contractHelper }, use) => {
    const assembler = new AssemblerHelper({
      browserHelper: new BrowserHelper({ pwPage: page, pwContext: context }),
      elementFinder: new ElementFinderHelper(page),
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
    const assembler = new AssemblerHelper({
      httpClient: new HttpClient(request),
      graphqlClient: new GraphQLClient(request),
    });
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
