import { ClassLog } from "@decorators/logger.decorators";
import { WalletSettingsPopupPo } from "@page-objects/index";
import {
  BaseService,
  IWalletSettingsPopupService,
  IWalletSettingsPopupServiceArgs,
  NetworkDetailsModalService,
} from "@services/index";

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
