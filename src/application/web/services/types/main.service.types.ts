import { MainPo } from "@pageObjects/main.po";
import { IBaseServiceArgs } from "@services/types/base.service.types";
import { ConnectWalletModalService } from "@services/connect-wallet-modal.service";
import { WalletSettingsPopupService } from "@services/wallet-settings-popup.service";
import { NetworkDetailsModalService } from "@services/network-details-modal.service";

export interface IMainServiceArgs extends IBaseServiceArgs {
  page: MainPo;
  connectWalletModal: ConnectWalletModalService;
  walletSettingsPopup: WalletSettingsPopupService;
  networkDetailsModal: NetworkDetailsModalService;
}
