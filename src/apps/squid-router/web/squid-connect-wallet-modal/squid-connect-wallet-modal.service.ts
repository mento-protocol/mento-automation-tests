import { ClassLog } from "@decorators/logger.decorators";
import { timeouts } from "@constants/timeouts.constants";
import { BaseService, IBaseServiceArgs } from "@shared/web/base/base.service";
import { waiterHelper } from "@helpers/waiter/waiter.helper";
import { SquidConnectWalletModalPage } from "./squid-connect-wallet-modal.page";

@ClassLog
export class SquidConnectWalletModalService extends BaseService {
  public override page: SquidConnectWalletModalPage = null;

  constructor(args: ISquidConnectWalletServiceArgs) {
    const { page } = args;
    super(args);
    this.page = page;
  }

  async selectWalletByName(name: WalletName): Promise<void> {
    return this.page.walletList[name].click({ timeout: timeouts.xxs });
  }

  async close({
    throwError = true,
  }: { throwError?: boolean } = {}): Promise<void> {
    await waiterHelper.retry(
      async () => {
        await this.page.cancelButton.click({
          force: true,
          timeout: timeouts.xxs,
        });
        return this.page.isClosed({ timeout: timeouts.xxs });
      },
      3,
      {
        errorMessage: "Failed to close connect wallet modal",
        throwError,
      },
    );
  }
}

export interface ISquidConnectWalletServiceArgs extends IBaseServiceArgs {
  page: SquidConnectWalletModalPage;
}

export enum WalletName {
  Metamask = "Metamask",
}
