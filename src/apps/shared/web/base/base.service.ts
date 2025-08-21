import { BrowserHelper } from "@helpers/browser/browser.helper";
import { envHelper } from "@helpers/env/env.helper";
import { MetamaskHelper } from "@helpers/wallet/metamask-wallet.helper";
import { BasePage } from "./base.page";
import { timeouts } from "@constants/timeouts.constants";
import { waiterHelper } from "@helpers/waiter/waiter.helper";
import { Page } from "@playwright/test";

export class BaseService {
  private readonly baseWebUrl = envHelper.getBaseWebUrl();

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
    return this.browser.openUrl(this.baseWebUrl);
  }

  async navigateToAppPage(page: string): Promise<void> {
    return this.browser.openUrl(`${this.baseWebUrl}/${page}`);
  }

  async getPageTitle(): Promise<string> {
    return this.browser.getTitle();
  }

  async getPageUrl(): Promise<string> {
    return this.browser.getCurrentUrl();
  }

  // TODO: Move to another service
  protected async isRateLoaded(): Promise<boolean> {
    if (!(await this.page.rateLabel.isDisplayed())) return false;
    const rateText = await this.page.rateLabel.getText();
    return rateText !== "...";
  }

  async waitForUrlToChange({
    initialUrl,
    page,
    timeout = timeouts.xxs,
  }: {
    initialUrl: string;
    timeout?: number;
    page?: Page;
  }): Promise<boolean> {
    return waiterHelper.wait(
      async () => {
        const currentPageUrl = page ? page.url() : await this.getPageUrl();
        return initialUrl !== currentPageUrl;
      },
      timeout,
      {
        errorMessage: `initial url is still the same: ${initialUrl}`,
      },
    );
  }
}

export interface IBaseServiceArgs {
  browser: BrowserHelper;
  page: BasePage;
  metamask: MetamaskHelper;
}
