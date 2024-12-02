import { MainPo } from "@page-objects/index";
import {
  IBaseServiceArgs,
  ConnectWalletModalService,
  WalletSettingsPopupService,
  NetworkDetailsModalService,
  WalletName,
} from "@services/index";
import { IWallet } from "@fixtures/common/common.fixture.types";

export interface IMainService {
  openConnectWalletModalFromHeader: () => Promise<void>;
  openConnectWalletModal: () => Promise<void>;
  openAppWithConnectedWallet: (
    wallet: IWallet,
    walletName: WalletName,
  ) => Promise<void>;
  connectWalletByName: (
    wallet: IWallet,
    walletName: WalletName,
  ) => Promise<void>;
  isWalletConnected: () => Promise<boolean>;
}

export interface IMainServiceArgs extends IBaseServiceArgs {
  page: MainPo;
  connectWalletModal: ConnectWalletModalService;
  walletSettingsPopup: WalletSettingsPopupService;
  networkDetailsModal: NetworkDetailsModalService;
}
