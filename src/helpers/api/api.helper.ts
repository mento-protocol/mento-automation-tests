import { request } from "@playwright/test";

import { HttpClient } from "@shared/api/http/http-client";

class ApiHelper {
  public readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }
}

export const apiHelper = new ApiHelper(new HttpClient(request.newContext()));
