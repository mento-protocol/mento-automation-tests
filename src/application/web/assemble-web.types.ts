import { Page } from "@playwright/test";

import { Browser } from "@helpers/browser/browser.helper";
import { MainService, SwapService } from "@services/index";
import { MetamaskHelper } from "@helpers/wallet/metamask-wallet.helper";

export interface IAssembleWebArgs {
  pwPage: Page;
  browser: Browser;
  metamaskHelper: MetamaskHelper;
}

export interface IAssembleWeb {
  browser: Browser;
  metamaskHelper: MetamaskHelper;
  main: MainService;
  swap: SwapService;
}
