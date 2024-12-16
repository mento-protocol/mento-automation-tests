import { MetaMaskWallet } from "@tenkeylabs/dappwright";

import { ClassLog } from "@decorators/logger.decorators";

export interface IMetamaskWalletHelper {
  confirmTransaction: () => Promise<void>;
  rejectSwapTransaction: () => Promise<void>;
  confirmNetworkSwitch: () => Promise<void>;
  rejectNetworkSwitch: () => Promise<void>;
}

@ClassLog
export class MetamaskWalletHelper implements IMetamaskWalletHelper {
  constructor(private wallet: MetaMaskWallet) {}

  async confirmTransaction(): Promise<void> {
    const popup = await this.wallet.page.context().waitForEvent("page");
    await popup.getByRole("button", { name: "Confirm" }).click();
  }

  async rejectSwapTransaction(): Promise<void> {
    await this.confirmTransaction();
    const popup = await this.wallet.page.context().waitForEvent("page");
    await popup.getByTestId("page-container-footer-cancel").click();
  }

  async confirmNetworkSwitch(): Promise<void> {
    const popup = await this.wallet.page.context().waitForEvent("page");
    await popup.getByText("Approve").click();
    if (!popup.isClosed()) {
      await popup.waitForEvent("close");
    }
  }

  async rejectNetworkSwitch(): Promise<void> {
    const popup = await this.wallet.page.context().waitForEvent("page");
    await popup.getByText("Cancel").click();
    if (!popup.isClosed()) {
      await popup.waitForEvent("close");
    }
  }
}
