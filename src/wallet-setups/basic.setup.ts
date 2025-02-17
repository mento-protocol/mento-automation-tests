import { defineWalletSetup } from "@synthetixio/synpress";
import { MetaMask } from "@synthetixio/synpress/playwright";

import { processEnv } from "@helpers/processEnv/processEnv.helper";

export default defineWalletSetup(
  processEnv.WALLET_PASSWORD,
  async (context, walletPage) => {
    const metamask = new MetaMask(
      context,
      walletPage,
      processEnv.WALLET_PASSWORD,
    );
    await metamask.importWallet(processEnv.SEED_PHRASE);
  },
);
