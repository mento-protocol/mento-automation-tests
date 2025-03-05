import { defineWalletSetup } from "@synthetixio/synpress";
import { MetaMask } from "@synthetixio/synpress/playwright";

import { envHelper } from "@helpers/env/env.helper";

const walletPassword = envHelper.getWalletPassword();

export default defineWalletSetup(
  walletPassword,
  async (context, walletPage) => {
    const metamask = new MetaMask(context, walletPage, walletPassword);
    await metamask.importWallet(envHelper.getSeedPhrase());
  },
);
