import { BrowserContext, Page } from "@playwright/test";
import {
  IAddCookie,
  IBrowserArgs,
  IScrollBy,
  ISetLocalStorage,
} from "@helpers/browser/browser.helper.types";
import { bind } from "lodash";

export interface IBrowser {
  openUrl: (url: string) => Promise<void>;
  setLocalStorage: (params: ISetLocalStorage) => Promise<void>;
  addCookies: (params: IAddCookie[]) => Promise<void>;
  scrollBy: (params: IScrollBy) => Promise<void>;
  getTitle: () => Promise<string>;
}

export class Browser implements IBrowser {
  private pwPage: Page = null;
  private context: BrowserContext = null;

  constructor(args: IBrowserArgs) {
    const { pwPage, context } = args;
    this.pwPage = pwPage;
    this.context = context;
  }

  async openUrl(url: string): Promise<void> {
    await this.pwPage.goto(url);
  }

  async setLocalStorage(params: ISetLocalStorage): Promise<void> {
    await this.pwPage.addInitScript(_params => {
      const { key, value } = _params;
      // @ts-ignore
      window.localStorage.setItem(key, value);
    }, params);
  }

  async addCookies(params: IAddCookie[]): Promise<void> {
    await this.context.addCookies(params);
  }

  async scrollBy(params: IScrollBy): Promise<void> {
    const { x, y } = params;
    await this.pwPage.mouse.wheel(x, y);
  }

  async getTitle(): Promise<string> {
    return this.pwPage.title();
  }

  async pause(): Promise<void> {
    return this.pwPage.pause();
  }

  async refresh(): Promise<void> {
    await this.pwPage.reload();
  }
}
