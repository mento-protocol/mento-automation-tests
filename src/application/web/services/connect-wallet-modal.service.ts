import { BaseService } from "@services/base.service";
import { loggerHelper } from "@helpers/logger/logger.helper";
import { ClassLog } from "@decorators/logger.decorators";
import { ConnectWalletModalPo } from "@pageObjects/connect-wallet-modal.po";
import { IBaseServiceArgs } from "@services/types/base.service.types";

const logger = loggerHelper.get("ConnectWalletService");

export interface IConnectWalletService {
  selectWalletByName: (name: WalletName) => Promise<void>;
  close: () => Promise<void>;
}

export interface IConnectWalletServiceArgs extends IBaseServiceArgs {
  page: ConnectWalletModalPo;
}

@ClassLog
export class ConnectWalletModalService
  extends BaseService
  implements IConnectWalletService
{
  public override page: ConnectWalletModalPo = null;

  constructor(args: IConnectWalletServiceArgs) {
    const { page } = args;
    super(args);
    this.page = page;
  }

  async selectWalletByName(name: WalletName): Promise<void> {
    return this.page.walletList[name].click();
  }

  async close(): Promise<void> {
    return this.page.closeButton.click();
  }
}

export enum WalletName {
  Metamask = "Metamask",
}
