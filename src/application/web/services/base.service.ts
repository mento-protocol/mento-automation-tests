import { Browser } from "@helpers/browser/browser.helper";
import { envHelper } from "@helpers/env/env.helper";
import { BasePo } from "@pageObjects/base.po";
import { IBaseServiceArgs } from "@services/types/base.service.types";

interface IBaseService {
  navigateToApp: () => Promise<void>;
  getPageTitle: () => Promise<string>;
}

export class BaseService implements IBaseService {
  // change browser to protected or move it completely
  public browser: Browser = null;
  protected page: BasePo = null;

  constructor(args: IBaseServiceArgs) {
    const { browser } = args;
    this.browser = browser;
  }

  async navigateToApp(): Promise<void> {
    return this.browser.openUrl(envHelper.getBaseWebUrl());
  }

  async getPageTitle(): Promise<string> {
    return this.browser.getTitle();
  }
}
