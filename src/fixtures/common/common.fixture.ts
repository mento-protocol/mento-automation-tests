import { metaMaskFixtures } from "@synthetixio/synpress/playwright";
import { testWithSynpress } from "@synthetixio/synpress";

import basicSetup from "../../wallet-setups/basic.setup";
import { init } from "@helpers/init/init.helper";
import { IApplicationFixtures } from "@fixtures/common/common.fixture.types";
import { MetamaskHelper } from "@helpers/wallet/metamask-wallet.helper";

const synpressFixture = testWithSynpress(metaMaskFixtures(basicSetup));

export const testFixture = synpressFixture.extend<IApplicationFixtures>({
  metamaskHelper: async ({ metamask }, use) => {
    const metamaskHelper = new MetamaskHelper(metamask);
    await use(metamaskHelper);
  },

  web: async ({ context, page, metamaskHelper }, use) => {
    const web = await init.web({
      existingContext: context,
      existingPage: page,
      metamaskHelper,
    });
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await web.swap.browser.collectErrors();
    await web.swap.browser.attachErrors();
    await use(web);
  },

  api: async ({ request }, use) => {
    const api = await init.api(request);
    await use(api);
  },
});

export { expect } from "@playwright/test";
