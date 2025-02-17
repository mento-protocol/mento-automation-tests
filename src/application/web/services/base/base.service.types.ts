import { Browser } from "@helpers/browser/browser.helper";
import { IMetamaskHelper } from "@helpers/wallet/metamask-wallet.helper";
import { BasePo } from "@page-objects/index";

export interface IBaseServiceArgs {
  browser: Browser;
  page: BasePo;
  metamaskHelper: IMetamaskHelper;
}
