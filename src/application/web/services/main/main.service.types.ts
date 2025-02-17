import { MainPo } from "@page-objects/index";
import {
  IBaseServiceArgs,
  ConnectWalletModalService,
  WalletSettingsPopupService,
  NetworkDetailsModalService,
  WalletName,
} from "@services/index";

export interface IMainService {
  openConnectWalletModalFromHeader: () => Promise<void>;
  openConnectWalletModal: () => Promise<void>;
  openAppWithConnectedWallet: (walletName: WalletName) => Promise<void>;
  connectWalletByName: (walletName: WalletName) => Promise<void>;
  isWalletConnected: () => Promise<boolean>;
}

export interface IMainServiceArgs extends IBaseServiceArgs {
  page: MainPo;
  connectWalletModal: ConnectWalletModalService;
  walletSettingsPopup: WalletSettingsPopupService;
  networkDetailsModal: NetworkDetailsModalService;
}
