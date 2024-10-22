import { MainPo } from "@web/pageObjects/main.po";
import { IBaseServiceArgs } from "../base.service";
import { IWallet } from "@fixtures/common.fixture";

export interface IMainServiceArgs extends IBaseServiceArgs {
  page: MainPo;
}

export interface IMainService {
  connectMetamaskWallet: (wallet: IWallet) => Promise<void>;
}
