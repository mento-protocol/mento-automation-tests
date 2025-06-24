import { Browser as IPwBrowser, BrowserContext, Page } from "@playwright/test";

import { Browser } from "@helpers/browser/browser.helper";
import { MetamaskHelper } from "@helpers/wallet/metamask-wallet.helper";

// todo: Change to conditional interface
export interface IInitWebOptions {
  pwBrowser?: IPwBrowser;
  existingContext?: BrowserContext;
  existingPage?: Page;
  metamaskHelper: MetamaskHelper;
}

export interface IInitBrowser {
  pwPage: Page;
  browser: Browser;
}
