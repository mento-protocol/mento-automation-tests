import { APIRequestContext } from "@playwright/test";

import { IInitBrowser, IInitWebOptions } from "@helpers/init/init.types";
import { IAssembleWeb } from "../../application/web/assemble-web.types";
import { assembleWeb } from "../../application/web/assemble-web";
import { assembleApi, IAssmbleApi } from "@api/assemble-api";
import { current } from "@helpers/current/current.helper";
import { Browser } from "@helpers/browser/browser.helper";

export const init = {
  async web(opts: IInitWebOptions): Promise<IAssembleWeb> {
    const { metamaskHelper } = opts;
    const { browser, pwPage } = await this.browser(opts);
    return assembleWeb({ pwPage, browser, metamaskHelper });
  },

  async api(pwApiContext: APIRequestContext): Promise<IAssmbleApi> {
    const api = assembleApi(pwApiContext);
    current.apis.push(api);
    current.apis.shift();
    return api;
  },

  async browser(opts: IInitWebOptions): Promise<IInitBrowser> {
    const { pwBrowser, existingContext, existingPage } = opts;
    const pwContext = existingContext ?? (await pwBrowser.newContext());
    const pwPage = existingContext ? existingPage : await pwContext.newPage();
    const browser = new Browser({ pwPage, pwContext });
    // @ts-ignore
    current.browsers.push(browser);
    current.browsers.shift();
    return { pwPage, browser };
  },
};
