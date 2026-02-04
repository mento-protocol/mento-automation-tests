import { MetaMask } from "@synthetixio/synpress/playwright";

import { ClassLog } from "@decorators/logger.decorators";
import { timeouts } from "@constants/timeouts.constants";
import { waiterHelper } from "@helpers/waiter/waiter.helper";

@ClassLog
export class MetamaskHelper {
  constructor(private metamask: MetaMask) {}

  get rawModule() {
    return this.metamask;
  }

  async connectWallet(): Promise<void> {
    return waiterHelper.retry(
      async () => {
        await waiterHelper.executeUntil(
          () => this.metamask.connectToDapp(),
          timeouts.xl,
          "Wallet connection timed out - MetaMask popup may not have appeared or is stuck",
        );
      },
      2,
      {
        interval: timeouts.xs,
        errorMessage: "Failed to connect wallet after multiple attempts",
        throwError: true,
        continueWithException: true,
        resolveWhenNoException: true,
      },
    );
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
    return waiterHelper.retry(
      async () => {
        try {
          const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => {
              reject(
                new Error(
                  "Transaction confirmation timed out - Metamask popup may not have appeared or is stuck",
                ),
              );
            }, timeouts.xl);
          });

          await Promise.race([
            this.metamask.confirmTransaction(),
            timeoutPromise,
          ]);
        } catch (error) {
          throw new Error(
            `Cannot confirm transaction because of error: ${error.message}`,
          );
        }
      },
      2,
      {
        interval: timeouts.xs,
        errorMessage: "Failed to confirm transaction after multiple attempts",
        throwError: true,
        continueWithException: true,
        resolveWhenNoException: true,
      },
    );
  }

  async rejectTransaction(): Promise<void> {
    this.metamask.rejectTransaction();
  }

  async rejectSwapTransaction(): Promise<void> {
    await this.confirmTransaction();
    await this.rejectTransaction();
  }
}
