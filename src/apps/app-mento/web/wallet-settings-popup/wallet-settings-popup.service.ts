import { ClassLog } from "@decorators/logger.decorators";
import { WalletSettingsPopupPage } from "./wallet-settings-popup.page";
import { BaseService, IBaseServiceArgs } from "@shared/web/base/base.service";
import { NetworkModalService } from "../network-modal/network-modal.service";

@ClassLog
export class WalletSettingsPopupService extends BaseService {
  public override page: WalletSettingsPopupPage = null;
  public networkDetails: NetworkModalService = null;

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

interface IWalletSettingsPopupServiceArgs extends IBaseServiceArgs {
  page: WalletSettingsPopupPage;
  networkDetails: NetworkModalService;
}
