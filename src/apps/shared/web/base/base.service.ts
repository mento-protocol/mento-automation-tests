import { BrowserHelper } from "@helpers/browser/browser.helper";
import { envHelper } from "@helpers/env/env.helper";
import { MetamaskHelper } from "@helpers/wallet/metamask-wallet.helper";
import { BasePage } from "./base.page";

export class BaseService {
  // change browser to protected or move it completely
  public browser: BrowserHelper = null;
  protected page: BasePage = null;
  protected metamask: MetamaskHelper = null;

  constructor(args: IBaseServiceArgs) {
    const { browser, metamask: metamaskHelper } = args;
    this.browser = browser;
    this.metamask = metamaskHelper;
  }

  async navigateToApp(): Promise<void> {
    return this.browser.openUrl(envHelper.getBaseWebUrl());
  }

  async getPageTitle(): Promise<string> {
    return this.browser.getTitle();
  }

  // TODO: Move to another service
  protected async isRateLoaded(): Promise<boolean> {
    if (!(await this.page.rateLabel.isDisplayed())) return false;
    const rateText = await this.page.rateLabel.getText();
    return rateText !== "...";
  }
}

export interface IBaseServiceArgs {
  browser: BrowserHelper;
  page: BasePage;
  metamask: MetamaskHelper;
}
