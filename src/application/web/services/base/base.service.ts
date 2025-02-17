import { Browser } from "@helpers/browser/browser.helper";
import { envHelper } from "@helpers/env/env.helper";
import { IMetamaskHelper } from "@helpers/wallet/metamask-wallet.helper";
import { BasePo } from "@page-objects/index";
import { IBaseServiceArgs } from "@services/index";

interface IBaseService {
  navigateToApp: () => Promise<void>;
  getPageTitle: () => Promise<string>;
}

export class BaseService implements IBaseService {
  // change browser to protected or move it completely
  public browser: Browser = null;
  protected page: BasePo = null;
  protected metamaskHelper: IMetamaskHelper = null;

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
}
