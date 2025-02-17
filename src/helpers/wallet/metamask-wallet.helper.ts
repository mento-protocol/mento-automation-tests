import { MetaMask } from "@synthetixio/synpress/playwright";

import { ClassLog } from "@decorators/logger.decorators";

export interface IMetamaskHelper {
  rawModule: MetaMask;

  connectWallet: () => Promise<void>;
  approveNewNetwork: () => Promise<void>;
  approveSwitchNetwork: () => Promise<void>;
  rejectSwitchNetwork: () => Promise<void>;
  getAddress: () => Promise<string>;
  confirmTransaction: () => Promise<void>;
  rejectTransaction: () => Promise<void>;
  rejectSwapTransaction: () => Promise<void>;
}

interface IConnectWalletOpts {
  isMentoWeb?: boolean;
}

@ClassLog
export class MetamaskHelper implements IMetamaskHelper {
  constructor(private metamask: MetaMask) {}

  get rawModule() {
    return this.metamask;
  }

  async connectWallet({
    isMentoWeb = true,
  }: IConnectWalletOpts = {}): Promise<void> {
    await this.metamask.connectToDapp();
    if (isMentoWeb) {
      await this.approveNewNetwork();
      await this.approveSwitchNetwork();
    }
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
    this.metamask.confirmTransaction();
  }

  async rejectTransaction(): Promise<void> {
    this.metamask.rejectTransaction();
  }

  async rejectSwapTransaction(): Promise<void> {
    await this.confirmTransaction();
    await this.rejectTransaction();
  }

  // todo: Think about
  // private async callMetamaskMethod<T>(
  //   method: (...args) => Promise<T>,
  //   args?: unknown[],
  // ) {
  //   try {
  //     console.log({ method, args });
  //     return method(args);
  //   } catch (error) {
  //     throw new Error(
  //       `Metamask '${method.name}' method has failed: ${error.message}`,
  //     );
  //   }
  // }
}
