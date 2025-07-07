import type { APIRequestContext } from "playwright-core";
import { request } from "@playwright/test";

import { HttpClient } from "./http/http-client";

export function assembleApi(pwApiContext: APIRequestContext): IAssmbleApi {
  const httpClient = new HttpClient(pwApiContext);

  return {
    httpClient,
  };
}

export const externalApi = await (async () => request.newContext())();

export interface IAssmbleApi {
  httpClient: HttpClient;
}
