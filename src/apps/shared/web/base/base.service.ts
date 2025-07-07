import { Browser } from "@helpers/browser/browser.helper";
import { envHelper } from "@helpers/env/env.helper";
import { MetamaskHelper } from "@helpers/wallet/metamask-wallet.helper";
import { BasePage } from "./base.page";

export class BaseService {
  // change browser to protected or move it completely
  public browser: Browser = null;
  protected page: BasePage = null;
  protected metamaskHelper: MetamaskHelper = null;

  constructor(args: IBaseServiceArgs) {
    const { browser, metamaskHelper } = args;
    this.browser = browser;
    this.metamaskHelper = metamaskHelper;
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
  browser: Browser;
  page: BasePage;
  metamaskHelper: MetamaskHelper;
}
