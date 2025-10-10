import { MetaMask } from "@synthetixio/synpress/playwright";

import { ClassLog } from "@decorators/logger.decorators";

@ClassLog
export class MetamaskHelper {
  constructor(private metamask: MetaMask) {}

  get rawModule() {
    return this.metamask;
  }

  async connectWallet(): Promise<void> {
    await this.metamask.connectToDapp();
  }

  async approveNewNetwork(): Promise<void> {
    return this.metamask.approveNewNetwork();
  }

  async approveSwitchNetwork(): Promise<void> {
    return this.metamask.approveSwitchNetwork();
  }

  async getAddress(): Promise<string> {
    return this.metamask.getAccountAddress();
  }

  async rejectSwitchNetwork(): Promise<void> {
    return this.metamask.rejectSwitchNetwork();
  }

  async confirmTransaction(): Promise<void> {
    try {
      return await this.metamask.confirmTransaction();
    } catch (error) {
      throw new Error(
        `Cannot confirm transaction because of error: ${error.message}`,
      );
    }
  }

  async rejectTransaction(): Promise<void> {
    this.metamask.rejectTransaction();
  }

  async rejectSwapTransaction(): Promise<void> {
    await this.confirmTransaction();
    await this.rejectTransaction();
  }
}
