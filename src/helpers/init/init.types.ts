import { Page } from "@playwright/test";
import { Browser } from "@helpers/browser/browser.helper";

export interface IInitBrowser {
  pwPage: Page;
  browser: Browser;
}
