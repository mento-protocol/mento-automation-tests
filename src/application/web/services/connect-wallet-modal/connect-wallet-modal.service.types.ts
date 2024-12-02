import { IBaseServiceArgs } from "@services/index";
import { ConnectWalletModalPo } from "@page-objects/index";

export interface IConnectWalletService {
  selectWalletByName: (name: WalletName) => Promise<void>;
  close: () => Promise<void>;
}

export interface IConnectWalletServiceArgs extends IBaseServiceArgs {
  page: ConnectWalletModalPo;
}

export enum WalletName {
  Metamask = "Metamask",
}
