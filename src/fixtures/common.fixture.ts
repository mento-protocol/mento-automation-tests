import { BrowserContext, test as base } from "@playwright/test";
import dappwright, { Dappwright, MetaMaskWallet } from "@tenkeylabs/dappwright";

import { IGetWebServices } from "@web/services/types/get-web-services.types";
import { IGetApi } from "@api/get-api";
import { init } from "@helpers/init/init.helper";
import { MetamaskWalletHelper } from "@helpers/wallet/metamask-wallet.helper";
import { envHelper } from "@helpers/env/env.helper";

export interface IWallet {
  metamask: Dappwright;
  helper: MetamaskWalletHelper;
}

type MyFixtures = {
  web: IGetWebServices;
  api: IGetApi;
  context: BrowserContext;
  wallet: IWallet;
};

export const testFixture = base.extend<MyFixtures>({
  web: async ({ browser, page }, use) => {
    const web = await init.web(browser, page);
    await use(web);
  },
  api: async ({ playwright: { request } }, use) => {
    const api = await init.api(request);
    await use(api);
  },

  context: async ({}, use) => {
    // Launch context with extension
    const [wallet, page, context] = await dappwright.bootstrap("", {
      wallet: "metamask",
      version: MetaMaskWallet.recommendedVersion,
      // I do not pass such data directly in repo - usually I pass it by env variables
      seed: "strike this hockey lazy ritual fragile fee inform gadget baby endless resemble",
      // unable to run without because of issue with Metamask for GitHub Actions - running with 'xvfb'
      headless: false,
    });
    await wallet.addNetwork({
      networkName: "Alfajores",
      rpc: "https://alfajores-forno.celo-testnet.org",
      chainId: 44787,
      symbol: "A-CELO",
    });
    await use(context);
  },

  wallet: async ({ context }, use) => {
    const metamask = await dappwright.getWallet("metamask", context);
    const helper = new MetamaskWalletHelper(metamask);
    await use({ metamask, helper });
  },
});

export { expect } from "@playwright/test";
