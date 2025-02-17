import type { APIRequestContext } from "playwright-core";
import { request } from "@playwright/test";

import { GenericHttpClient } from "@api/http/generic-http.client";
import { BaseHttpClient } from "@api/http/base-http.client";
import { AuthController } from "@api/controllers/auth/auth.controller";

export function assembleApi(pwApiContext: APIRequestContext): IAssmbleApi {
  const genericHttpClient = new GenericHttpClient(
    new BaseHttpClient(pwApiContext),
  );

  return {
    httpClient: genericHttpClient,
    auth: new AuthController(genericHttpClient),
  };
}

export const externalApi = await (async () => request.newContext())();

export interface IAssmbleApi {
  httpClient: GenericHttpClient;
  auth: AuthController;
}
