import { ClassLog } from "@decorators/logger.decorators";
import { timeouts } from "@constants/timeouts.constants";
import { BaseService, IBaseServiceArgs } from "@shared/web/base/base.service";
import { ConnectWalletModalPage } from "./connect-wallet-modal.page";

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
    return this.page.closeButton.click({
      force: true,
      timeout: timeouts.xxs,
    });
  }
}

export interface IConnectWalletServiceArgs extends IBaseServiceArgs {
  page: ConnectWalletModalPage;
}

export enum WalletName {
  Metamask = "Metamask",
}
