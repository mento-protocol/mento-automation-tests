import { WalletSettingsPopupPo } from "@page-objects/index";
import { NetworkDetailsModalService, IBaseServiceArgs } from "@services/index";

export interface IWalletSettingsPopupService {
  disconnect: () => Promise<void>;
  copyAddress: () => Promise<void>;
  openNetworkDetails: () => Promise<void>;
}

export interface IWalletSettingsPopupServiceArgs extends IBaseServiceArgs {
  page: WalletSettingsPopupPo;
  networkDetails: NetworkDetailsModalService;
}
