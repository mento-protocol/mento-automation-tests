import { Browser as IPwBrowser } from "playwright-core";
import { APIRequest, Page } from "@playwright/test";

import { getWeb } from "@web/get-web";
import { getApi, IGetApi } from "@api/get-api";
import { current } from "@helpers/current/current.helper";
import { Browser } from "@helpers/browser/browser.helper";
import { IGetWebServices } from "@web/services/types/get-web-services.types";
import { IInitBrowser } from "@helpers/init/init.types";

export const init = {
  async web(
    pwBrowser: IPwBrowser,
    existingPwPage?: Page,
  ): Promise<IGetWebServices> {
    const { browser, pwPage } = await this.browser(pwBrowser, existingPwPage);
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
    pwBrowser: IPwBrowser,
    existingPwPage?: Page,
  ): Promise<IInitBrowser> {
    const context = await pwBrowser.newContext({
      viewport: { width: 1920, height: 1080 },
    });
    const pwPage = existingPwPage ?? (await context.newPage());
    const browser = new Browser({ pwPage, context });
    // @ts-ignore
    current.browsers.push(browser);
    current.browsers.shift();
    return { pwPage, browser };
  },
};
