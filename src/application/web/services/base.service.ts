import { Browser } from "@helpers/browser/browser.helper";

export class BaseService {
  protected browser: Browser = null;

  constructor(args: IBaseServiceArgs) {
    const { browser } = args;
    this.browser = browser;
  }

  async openUrl(url: string): Promise<void> {
    return this.browser.openUrl(url);
  }

  async getPageTitle(): Promise<string> {
    return this.browser.getTitle();
  }
}

export interface IBaseServiceArgs {
  browser: Browser;
}
