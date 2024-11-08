import { MetaMaskWallet } from "@tenkeylabs/dappwright";
import { waiterHelper } from "@helpers/waiter/waiter.helper";

export class MetamaskWalletHelper {
  constructor(private wallet: MetaMaskWallet) {}

  // it's workaround due to bug of confirmTransaction method: https://github.com/TenKeyLabs/dappwright/issues/234
  async approveTransactionTwice(): Promise<void> {
    const popup = await this.wallet.page.context().waitForEvent("page");
    await popup.getByRole("button", { name: "Next" }).click();
    await waiterHelper.waitForAnimation();
    await popup.getByRole("button", { name: "Approve" }).click();
    await this.wallet.confirmTransaction();
  }
}
