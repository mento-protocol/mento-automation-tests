import { BaseService } from "@services/base.service";
import { ClassLog } from "@decorators/logger.decorators";
import { IBaseServiceArgs } from "@services/types/base.service.types";
import { WalletSettingsPopupPo } from "@pageObjects/wallet-settings-popup.po";
import { NetworkDetailsModalService } from "@services/network-details-modal.service";

export interface IWalletSettingsPopupService {
  disconnect: () => Promise<void>;
  copyAddress: () => Promise<void>;
  openNetworkDetails: () => Promise<void>;
}

export interface IWalletSettingsPopupServiceArgs extends IBaseServiceArgs {
  page: WalletSettingsPopupPo;
  networkDetails: NetworkDetailsModalService;
}

@ClassLog
export class WalletSettingsPopupService
  extends BaseService
  implements IWalletSettingsPopupService
{
  public override page: WalletSettingsPopupPo = null;
  public networkDetails: NetworkDetailsModalService = null;

  constructor(args: IWalletSettingsPopupServiceArgs) {
    const { page, networkDetails } = args;
    super(args);
    this.page = page;
    this.networkDetails = networkDetails;
  }

  async disconnect(): Promise<void> {
    return this.page.disconnectButton.click();
  }

  async copyAddress(): Promise<void> {
    return this.page.copyAddressButton.click();
  }

  async openNetworkDetails(): Promise<void> {
    return this.page.changeNetworkButton.click();
  }
}
