import { BrowserContext, Page } from "@playwright/test";
import {
  IAddCookie,
  IBrowserArgs,
  IScrollBy,
  ISetLocalStorage,
} from "@helpers/browser/browser.helper.types";
import { bind } from "lodash";
import { testUtils } from "@helpers/suite/suite.helper";
import { testFixture } from "@fixtures/common.fixture";

export interface IBrowser {
  openUrl: (url: string) => Promise<void>;
  setLocalStorage: (params: ISetLocalStorage) => Promise<void>;
  addCookies: (params: IAddCookie[]) => Promise<void>;
  scrollBy: (params: IScrollBy) => Promise<void>;
  getTitle: () => Promise<string>;
  attachConsoleErrorLogs: () => Promise<void>;
  collectConsoleErrorLogs: () => Promise<void>;
  hasConsoleErrorMatchingText: (text: string) => boolean;
}

export class Browser implements IBrowser {
  private pwPage: Page = null;
  private context: BrowserContext = null;

  private _consoleErrors: string[] = [];

  constructor(args: IBrowserArgs) {
    const { pwPage, context } = args;
    this.pwPage = pwPage;
    this.context = context;
  }

  get consoleErrors(): string[] {
    return this._consoleErrors;
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

  // V1
  async attachConsoleErrorLogs(): Promise<void> {
    this.pwPage.on("console", message => {
      if (message.type() === "error") {
        testFixture.info().attach("console-errors", {
          contentType: "text/plain",
          body: Buffer.from(message.text()),
        });
      }
    });
  }

  // V2
  // async attachConsoleErrorLogs(): Promise<void> {
  //   this.pwPage.on("console", message => {
  //     if (message.type() === "error") {
  //       const currentBuffer = Buffer.from(message.text());
  //       testFixture.info().attachments.forEach(attachment => {
  //         if (!attachment?.body.equals(currentBuffer)) {
  //           console.log();
  //           testFixture.info().attach("console-errors", {
  //             contentType: "text/plain",
  //             body: currentBuffer,
  //           });
  //         }
  //       });
  //     }
  //   });
  // }

  async collectConsoleErrorLogs(): Promise<void> {
    this.pwPage.on("console", message => {
      if (message.type() === "error") {
        this._consoleErrors.push(message.text());
      }
    });
  }

  hasConsoleErrorMatchingText(text: string): boolean {
    return this.consoleErrors.some(error => error.includes(text));
  }
}
