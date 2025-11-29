import { Page } from "@playwright/test";

import { BrowserHelper } from "@helpers/browser/browser.helper";
import { envHelper } from "@helpers/env/env.helper";
import { MetamaskHelper } from "@helpers/wallet/metamask-wallet.helper";
import { BasePage } from "./base.page";
import { timeouts } from "@constants/timeouts.constants";
import { waiterHelper } from "@helpers/waiter/waiter.helper";
import { CeloScanService } from "../celo-scan/celo-scan.service";
import { ContractHelper } from "@helpers/contract/contract.helper";

export class BaseService {
  private readonly baseWebUrl = envHelper.getBaseWebUrl();

  // change browser to protected or move it completely
  public browser: BrowserHelper = null;
  protected page: BasePage = null;
  protected metamask: MetamaskHelper = null;
  protected contract: ContractHelper = null;

  constructor(args: IBaseServiceArgs) {
    const { browser, metamask: metamaskHelper, contract } = args;
    this.browser = browser;
    this.metamask = metamaskHelper;
    this.contract = contract;
  }

  async navigateToApp(): Promise<void> {
    return this.browser.openUrl(this.baseWebUrl);
  }

  async navigateToAppPage(page: string): Promise<void> {
    return this.browser.openUrl(`${this.baseWebUrl}/${page}`);
  }

  async getPageTitle(): Promise<string> {
    return this.browser.getPageTitle();
  }

  async getPageUrl(): Promise<string> {
    return this.browser.getCurrentPageUrl();
  }

  async pressButton(buttonName: string): Promise<void> {
    await this.browser.pressButton(buttonName);
  }

  async verifyIsOpen(): Promise<void> {
    return this.page.verifyIsOpen();
  }

  async verifyIsClosed(): Promise<void> {
    return this.page.verifyIsClosed();
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
  contract?: ContractHelper;
  metamask?: MetamaskHelper;
  celoScan?: CeloScanService;
  contract?: ContractHelper;
}
