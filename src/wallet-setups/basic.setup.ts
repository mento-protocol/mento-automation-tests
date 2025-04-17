import { defineWalletSetup } from "@synthetixio/synpress";
import { MetaMask } from "@synthetixio/synpress/playwright";
import { magicStrings } from "@constants/magic-strings.constants";
import { envHelper } from "@helpers/env/env.helper";

const password = envHelper.getWalletPassword();
const seed = envHelper.getSeedPhrase();

export default defineWalletSetup(password, async (context, walletPage) => {
  const metamask = new MetaMask(context, walletPage, password);
  await metamask.importWallet(seed);
  await metamask.addNetwork(
    envHelper.isMainnet()
      ? magicStrings.chain.mainnet
      : magicStrings.chain.testnet,
  );
});
