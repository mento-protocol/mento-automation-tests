import { APIRequest, BrowserContext, Page } from "@playwright/test";

import { getApi, IGetApi } from "@api/get-api";
import { current } from "@helpers/current/current.helper";
import { Browser } from "@helpers/browser/browser.helper";
import { IInitBrowser } from "@helpers/init/init.types";
import { getWeb } from "../../application/web/get-web";
import { IGetWebServices } from "../../application/web/get-web.types";

export const init = {
  async web(
    existingContext?: BrowserContext,
    existingPwPage?: Page,
  ): Promise<IGetWebServices> {
    const { browser, pwPage } = await this.browser(
      existingContext,
      existingPwPage,
    );
    return getWeb({ pwPage, browser });
  },

  async api(pwApi: APIRequest): Promise<IGetApi> {
    const apiContext = pwApi.newContext();
    const api = getApi(apiContext);
    current.apis.push(api);
    current.apis.shift();
    return api;
  },

  async browser(
    existingContext?: BrowserContext,
    existingPwPage?: Page,
  ): Promise<IInitBrowser> {
    const pwPage = existingPwPage ?? (await existingContext.newPage());
    const browser = new Browser({ pwPage, context: existingContext });
    // @ts-ignore
    current.browsers.push(browser);
    current.browsers.shift();
    return { pwPage, browser };
  },
};
