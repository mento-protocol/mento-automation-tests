import { MetaMaskWallet } from "@tenkeylabs/dappwright";

import { waiterHelper } from "@helpers/waiter/waiter.helper";

export interface IMetamaskWalletHelper {
  approveTransactionTwice: () => Promise<void>;
  rejectSwapTransaction: () => Promise<void>;
  confirmNetworkSwitch: () => Promise<void>;
}

export class MetamaskWalletHelper implements IMetamaskWalletHelper {
  constructor(private wallet: MetaMaskWallet) {}

  // it's workaround due to bug of confirmTransaction method: https://github.com/TenKeyLabs/dappwright/issues/234
  async approveTransactionTwice(): Promise<void> {
    const popup = await this.wallet.page.context().waitForEvent("page");
    await popup.getByRole("button", { name: "Next" }).click();
    await waiterHelper.waitForAnimation();
    await popup.getByRole("button", { name: "Approve" }).click();
  }

  async rejectSwapTransaction(): Promise<void> {
    await this.approveTransactionTwice();
    const popup = await this.wallet.page.context().waitForEvent("page");
    await popup.getByTestId("page-container-footer-cancel").click();
  }

  async confirmNetworkSwitch(): Promise<void> {
    const popup = await this.wallet.page.context().waitForEvent("page");
    await popup.getByTestId("confirmation-submit-button").click();
    await waiterHelper.waitForAnimation();
    await popup.getByTestId("confirmation-submit-button").click();
    if (!popup.isClosed()) {
      await popup.waitForEvent("close");
    }
  }
}
