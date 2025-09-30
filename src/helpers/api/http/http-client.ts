import { APIResponse } from "@playwright/test";

import { IHttpRequestArgs, IHttpResponse, Method } from "./http.types";
import { loggerHelper } from "@helpers/logger/logger.helper";
import { primitiveHelper } from "@helpers/primitive/primitive.helper";
import { RequestModule } from "../api.helper";

const logger = loggerHelper.get("Http-Client");

export class HttpClient {
  constructor(private readonly requestModule: RequestModule) {}

  async get<T>(args: IHttpRequestArgs): Promise<IHttpResponse<T>> {
    return this.sendRequest<T>(Method.GET, args);
  }

  async post<T>(args: IHttpRequestArgs): Promise<IHttpResponse<T>> {
    return this.sendRequest<T>(Method.POST, args);
  }

  async put<T>(args: IHttpRequestArgs): Promise<IHttpResponse<T>> {
    return this.sendRequest<T>(Method.PUT, args);
  }

  async patch<T>(args: IHttpRequestArgs): Promise<IHttpResponse<T>> {
    return this.sendRequest<T>(Method.PATCH, args);
  }

  async delete<T>(args: IHttpRequestArgs): Promise<IHttpResponse<T>> {
    return this.sendRequest<T>(Method.DELETE, args);
  }

  private async sendRequest<T>(
    method: Method,
    args: IHttpRequestArgs,
  ): Promise<IHttpResponse<T>> {
    const { url, headers, body, timeout = 0 } = args;
    const request = {
      method,
      headers,
      data: body,
      timeout,
    };
    logger.trace(
      `Request: ${primitiveHelper.jsonStringify({ url, ...request })}`,
    );
    try {
      const response = await this.fetch(url, request);
      const responseHeaders = response.headers();
      const responseData = responseHeaders["content-type"].includes("json")
        ? await response.json()
        : await response.text();

      return {
        data: responseData,
        headers: responseHeaders,
        status: response.status(),
      };
    } catch (error) {
      const errorMessage = `Failed to send request or handle response.\nRequest: ${primitiveHelper.jsonStringify(
        { url, ...request },
      )}\nError: ${error.message}`;
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  private async fetch(url: string, request): Promise<APIResponse> {
    return this.requestModule instanceof Promise
      ? await (await this.requestModule).fetch(url, request)
      : await this.requestModule.fetch(url, request);
  }
}
