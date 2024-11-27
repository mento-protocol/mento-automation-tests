import { BaseService } from "@services/base.service";
import { loggerHelper } from "@helpers/logger/logger.helper";
import { ClassLog } from "@decorators/logger.decorators";
import { IBaseServiceArgs } from "@services/types/base.service.types";
import { WalletSettingsPopupPo } from "@pageObjects/wallet-settings-popup.po";

const logger = loggerHelper.get("WalletSettingsPopupService");

// todo: FILL
export interface IWalletSettingsPopupService {}

export interface IWalletSettingsPopupServiceArgs extends IBaseServiceArgs {
  page: WalletSettingsPopupPo;
}

@ClassLog
export class WalletSettingsPopupService
  extends BaseService
  implements IWalletSettingsPopupService
{
  public override page: WalletSettingsPopupPo = null;

  constructor(args: IWalletSettingsPopupServiceArgs) {
    const { page } = args;
    super(args);
    this.page = page;
  }

  async disconnect(): Promise<void> {
    return this.page.disconnectButton.click();
  }

  async;
}
