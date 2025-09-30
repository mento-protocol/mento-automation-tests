import { envHelper } from "@helpers/env/env.helper";
import { HttpClient } from "../../../../helpers/api/http/http-client";
import {
  IBaseApiRequestArgs,
  IHttpResponse,
} from "../../../../helpers/api/http/http.types";

export abstract class BaseHttpApi {
  private readonly baseUrl = envHelper.getBaseApiUrl();

  protected constructor(protected readonly httpClient: HttpClient) {}

  protected abstract get defaultHeaders(): Record<string, string>;

  protected async get<T>(args: IBaseApiRequestArgs): Promise<IHttpResponse<T>> {
    const { relativeUrl, headers, timeout } = args;
    return this.httpClient.get({
      url: this.constructUrl(relativeUrl),
      headers: { ...this.defaultHeaders, ...headers },
      timeout,
    });
  }

  protected async post<T>(
    args: IBaseApiRequestArgs,
  ): Promise<IHttpResponse<T>> {
    const { headers, body, relativeUrl, timeout } = args;
    return this.httpClient.post({
      url: this.constructUrl(relativeUrl),
      headers: { ...this.defaultHeaders, ...headers },
      body,
      timeout,
    });
  }

  protected async put<T>(args: IBaseApiRequestArgs): Promise<IHttpResponse<T>> {
    const { headers, body, relativeUrl, timeout } = args;
    return this.httpClient.put({
      url: this.constructUrl(relativeUrl),
      headers: { ...this.defaultHeaders, ...headers },
      body,
      timeout,
    });
  }

  protected async patch<T>(
    args: IBaseApiRequestArgs,
  ): Promise<IHttpResponse<T>> {
    const { relativeUrl, headers, body, timeout } = args;
    return this.httpClient.patch({
      url: this.constructUrl(relativeUrl),
      headers: { ...this.defaultHeaders, ...headers },
      body,
      timeout,
    });
  }

  protected async delete<T>(
    args: IBaseApiRequestArgs,
  ): Promise<IHttpResponse<T>> {
    const { relativeUrl, headers, body, timeout } = args;
    return this.httpClient.delete({
      url: this.constructUrl(relativeUrl),
      headers: { ...this.defaultHeaders, ...headers },
      body,
      timeout,
    });
  }

  private constructUrl(relativeUrl: string): string {
    return `${this.baseUrl}/${relativeUrl}`;
  }
}
