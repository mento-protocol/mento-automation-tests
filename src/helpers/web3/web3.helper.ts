import { ethers } from "ethers";

class Web3Helper {
  private readonly ethDerivationPath = "m/44'/60'/0'/0/0";

  constructor() {}

  extractPrivateKey(mnemonicSeedPhrase: string): string {
    if (!mnemonicSeedPhrase) throw new Error("Seed phrase is empty");

    try {
      const hdNode = ethers.utils.HDNode.fromMnemonic(mnemonicSeedPhrase);
      const derivedPath = hdNode.derivePath(this.ethDerivationPath);
      const privateKey = derivedPath?.privateKey;

      if (!privateKey) throw new Error("Failed to get private key from seed");

      return privateKey;
    } catch {
      throw new Error("Failed to extract private key");
    }
  }
}

export const web3Helper = new Web3Helper();
