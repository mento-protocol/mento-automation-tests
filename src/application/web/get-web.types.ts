import { Page } from "@playwright/test";

import { Browser } from "@helpers/browser/browser.helper";
import { MainService, SwapService, CeloExplorerService } from "@services/index";

export interface IGetServicesArgs {
  pwPage: Page;
  browser: Browser;
}

export interface IGetWebServices {
  main: MainService;
  swap: SwapService;
  celoExplorer: CeloExplorerService;
}
