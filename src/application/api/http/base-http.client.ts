import { APIRequestContext } from "playwright-core";

import { loggerHelper } from "@helpers/logger/logger.helper";
import {
  IBaseApiRequestArgs,
  IBaseHttpClient,
  IGenericHttpResponse,
  Method,
} from "./http.types";

const logger = loggerHelper.get("Base-Http");

export class BaseHttpClient implements IBaseHttpClient {
  private apiModulePromise: Promise<APIRequestContext> = null;
  constructor(apiModulePromise: Promise<APIRequestContext>) {
    this.apiModulePromise = apiModulePromise;
  }

  async sendRequest<T>(
    method: Method,
    args: IBaseApiRequestArgs,
  ): Promise<IGenericHttpResponse<T>> {
    const { url, headers, body, timeout = 0 } = args;
    const request = {
      method,
      headers,
      data: body,
      timeout,
    };
    try {
      const response = await (await this.apiModulePromise).fetch(url, request);
      return {
        data: await response.json(),
        headers: response.headers(),
        status: response.status(),
      };
    } catch (error) {
      const errorMessage = `Failed to send request. Request: ${request}, Error: ${error.message}`;
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }
  }
}
