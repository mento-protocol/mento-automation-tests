import { ethers } from "ethers";
import { Address } from "viem";

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

  extractAddress(mnemonicSeedPhrase: string): Address {
    if (!mnemonicSeedPhrase) throw new Error("Seed phrase is empty");

    try {
      const hdNode = ethers.utils.HDNode.fromMnemonic(mnemonicSeedPhrase);
      const derivedPath = hdNode.derivePath(this.ethDerivationPath);
      const address = derivedPath?.address;

      if (!address) throw new Error("Failed to get address from seed");

      return address as Address;
    } catch {
      throw new Error("Failed to extract address");
    }
  }

  toWei(amount: string | number, decimals = 18): bigint {
    return BigInt(amount) * BigInt(10 ** decimals);
  }

  toHex(amount: bigint): string {
    return `0x${amount.toString(16)}`;
  }

  truncateAddress(address: string): string {
    const changedAddress = address.toLowerCase();
    return `${changedAddress.slice(0, 6)}...${changedAddress.slice(-4)}`;
  }
}

export const web3Helper = new Web3Helper();
