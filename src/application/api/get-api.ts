import type { APIRequestContext } from "playwright-core";
import { request } from "@playwright/test";

import { GenericHttpClient } from "@api/http/generic-http.client";
import { BaseHttpClient } from "@api/http/base-http.client";
import { AuthController } from "@api/controllers/auth/auth.controller";

export function getApi(
  testApiModulePromise: Promise<APIRequestContext>,
): IGetApi {
  return {
    ...utils.getGenericApi(testApiModulePromise),
  };
}

function getExternalApi(): IGetApi {
  return {
    ...utils.getGenericApi(),
  };
}

const utils = {
  getGenericApi(testApiModulePromise?: Promise<APIRequestContext>): IGetApi {
    const apiModulePromise = utils.getDefinedApiModule(testApiModulePromise);
    const genericHttpClient = utils.getGenericHttpByModule(apiModulePromise);
    return {
      auth: new AuthController(genericHttpClient),
    };
  },

  getDefinedApiModule(
    testApiModule: Promise<APIRequestContext>,
  ): Promise<APIRequestContext> {
    return testApiModule ? testApiModule : request.newContext();
  },

  getGenericHttpByModule(
    apiModulePromise: Promise<APIRequestContext>,
  ): GenericHttpClient {
    return new GenericHttpClient(new BaseHttpClient(apiModulePromise));
  },
};

export const externalApi = getExternalApi();

export interface IGetApi {
  auth: AuthController;
}
