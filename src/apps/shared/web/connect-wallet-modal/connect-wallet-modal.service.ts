import { ClassLog } from "@decorators/logger.decorators";
import { timeouts } from "@constants/timeouts.constants";
import { BaseService, IBaseServiceArgs } from "@shared/web/base/base.service";
import { ConnectWalletModalPage } from "./connect-wallet-modal.page";
import { waiterHelper } from "@helpers/waiter/waiter.helper";

@ClassLog
export class ConnectWalletModalService extends BaseService {
  public override page: ConnectWalletModalPage = null;

  constructor(args: IConnectWalletServiceArgs) {
    const { page } = args;
    super(args);
    this.page = page;
  }

  async selectWalletByName(name: WalletName): Promise<void> {
    return this.page.walletList[name].click({ timeout: timeouts.xxs });
  }

  async close(): Promise<void> {
    await waiterHelper.retry(
      async () => {
        await this.page.closeButton.click({
          force: true,
          timeout: timeouts.xxs,
        });
        return this.page.isClosed({ timeout: timeouts.xxs });
      },
      3,
      {
        errorMessage: "Failed to close connect wallet modal",
        throwError: false,
      },
    );
  }
}

export interface IConnectWalletServiceArgs extends IBaseServiceArgs {
  page: ConnectWalletModalPage;
}

export enum WalletName {
  Metamask = "Metamask",
}
