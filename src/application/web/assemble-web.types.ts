import { Page } from "@playwright/test";

import { Browser } from "@helpers/browser/browser.helper";
import { MainService, SwapService } from "@services/index";
import { IMetamaskHelper } from "@helpers/wallet/metamask-wallet.helper";

export interface IAssembleWebArgs {
  pwPage: Page;
  browser: Browser;
  metamaskHelper: IMetamaskHelper;
}

export interface IAssembleWeb {
  main: MainService;
  swap: SwapService;
}
