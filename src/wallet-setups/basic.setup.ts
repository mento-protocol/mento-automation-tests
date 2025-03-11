import { defineWalletSetup } from "@synthetixio/synpress";
import { MetaMask } from "@synthetixio/synpress/playwright";

import { envHelper } from "@helpers/env/env.helper";
import { magicStrings } from "@constants/magic-strings.constants";

const walletPassword = envHelper.getWalletPassword();

export default defineWalletSetup(
  walletPassword,
  async (context, walletPage) => {
    const metamask = new MetaMask(context, walletPage, walletPassword);
    await metamask.importWallet(envHelper.getSeedPhrase());
    await metamask.addNetwork(
      envHelper.isMainnet()
        ? magicStrings.chain.mainnet
        : magicStrings.chain.testnet,
    );
  },
);
