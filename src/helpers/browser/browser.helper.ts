import { BrowserContext, Page } from "@playwright/test";

import {
  AttachUniqueInReportArgs,
  IAddCookie,
  IAttachInReportArgs,
  IBrowserArgs,
  IScrollBy,
  ISetLocalStorage,
} from "@helpers/browser/browser.helper.types";
import { testFixture } from "@fixtures/common/common.fixture";
import { primitiveHelper } from "@helpers/primitive/primitive.helper";

export interface IBrowser {
  openUrl: (url: string) => Promise<void>;
  setLocalStorage: (params: ISetLocalStorage) => Promise<void>;
  addCookies: (params: IAddCookie[]) => Promise<void>;
  scrollBy: (params: IScrollBy) => Promise<void>;
  getTitle: () => Promise<string>;
  execute: (
    callback: (args?: unknown[]) => Promise<unknown>,
  ) => Promise<unknown>;
  attachInReport: (args: IAttachInReportArgs) => Promise<void>;
  attachErrors: () => Promise<void>;
  collectErrors: () => Promise<void>;
  hasConsoleErrorsMatchingText: (text: string) => boolean;
  readFromClipboard: () => Promise<string>;
}

export class Browser implements IBrowser {
  private pwPage: Page = null;
  private pwContext: BrowserContext = null;

  private _consoleErrors: string[] = [];
  private _pageErrors: string[] = [];

  constructor(args: IBrowserArgs) {
    const { pwPage, pwContext } = args;
    this.pwPage = pwPage;
    this.pwContext = pwContext;
  }

  get consoleErrors(): string[] {
    return this._consoleErrors;
  }

  get pageErrors(): string[] {
    return this._pageErrors;
  }

  async openUrl(url: string): Promise<void> {
    await this.pwPage.goto(url);
  }

  async setLocalStorage(params: ISetLocalStorage): Promise<void> {
    await this.pwPage.addInitScript(_params => {
      const { key, value } = _params;
      window.localStorage.setItem(key, value);
    }, params);
  }

  async addCookies(params: IAddCookie[]): Promise<void> {
    await this.pwContext.addCookies(params);
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

  async execute<R>(
    callback: (args?: unknown[]) => Promise<R>,
    args: unknown[] = [],
  ): Promise<R> {
    return this.pwPage.evaluate(callback, args);
  }

  async readFromClipboard(): Promise<string> {
    return this.execute(() => navigator.clipboard.readText());
  }

  hasConsoleErrorsMatchingText(text: string): boolean {
    return this.consoleErrors.some(error => error.includes(text));
  }

  async collectErrors(): Promise<void> {
    this.pwPage.on("console", message => {
      if (message.type() === "error") {
        this._consoleErrors.push(message.text());
      }
    });
    this.pwPage.on("pageerror", exception => {
      this._pageErrors.push(exception.message);
    });
  }

  async attachInReport(args: IAttachInReportArgs): Promise<void> {
    const { name, body, contentType = "text/plain" } = args;
    return testFixture.info().attach(name, {
      contentType,
      body,
    });
  }

  async attachErrors(): Promise<void> {
    await this.attachConsoleErrorLogs();
    await this.attachPageErrors();
  }

  private async attachConsoleErrorLogs(): Promise<void> {
    const name = `console-error-${primitiveHelper.getCurrenTime()}`;
    this.pwPage.on("console", async message => {
      if (message.type() === "error") {
        const logMessageBuffer = Buffer.from(message.text());
        testFixture.info().attachments.length
          ? await this.attachUniqueInReport({ name, body: logMessageBuffer })
          : await this.attachInReport({ name, body: logMessageBuffer });
      }
    });
  }

  private async attachPageErrors(): Promise<void> {
    const name = `page-errors-${primitiveHelper.getCurrenTime()}`;
    this.pwPage.on("pageerror", async error => {
      const errorMessageBuffer = Buffer.from(error.message);
      testFixture.info().attachments.length
        ? await this.attachUniqueInReport({ name, body: errorMessageBuffer })
        : await this.attachInReport({ name, body: errorMessageBuffer });
    });
  }

  private async attachUniqueInReport(
    args: AttachUniqueInReportArgs,
  ): Promise<void> {
    const { name, body } = args;
    for (const attachment of testFixture.info().attachments) {
      if (!attachment?.body.equals(body)) {
        await this.attachInReport({ name, body });
      }
    }
  }
}
