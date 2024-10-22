import { envHelper } from "@helpers/env/env.helper";
import { urlHelper } from "@helpers/url/url.helper";
import { GenericHttpClient } from "../http/generic-http.client";
import { IGenericHttpResponse, IMainApiRequestArgs } from "../http/http.types";

export class BaseController {
  private readonly baseUrl = envHelper.getBaseApiUrl();

  protected constructor(protected genericHttp: GenericHttpClient) {
    this.genericHttp = genericHttp;
  }

  protected async get<T>(
    args: IMainApiRequestArgs,
  ): Promise<IGenericHttpResponse<T>> {
    const { token, headers, pathParams, queries, timeout } = args;
    return this.genericHttp.get({
      url: this.getUrl(pathParams, queries),
      headers: this.getHeaders(token, headers),
      timeout,
    });
  }

  protected async post<T>(
    args: IMainApiRequestArgs,
  ): Promise<IGenericHttpResponse<T>> {
    const { token = null, headers, body, pathParams, queries, timeout } = args;
    return this.genericHttp.post({
      url: this.getUrl(pathParams, queries),
      headers: this.getHeaders(token, headers),
      body,
      timeout,
    });
  }

  protected async put<T>(
    args: IMainApiRequestArgs,
  ): Promise<IGenericHttpResponse<T>> {
    const { token = null, headers, body, pathParams, queries, timeout } = args;
    return this.genericHttp.put({
      url: this.getUrl(pathParams, queries),
      headers: this.getHeaders(token, headers),
      body,
      timeout,
    });
  }

  protected async patch<T>(
    args: IMainApiRequestArgs,
  ): Promise<IGenericHttpResponse<T>> {
    const {
      token = null,
      headers = { token },
      body,
      pathParams,
      queries,
      timeout,
    } = args;
    return this.genericHttp.patch({
      url: this.getUrl(pathParams, queries),
      headers: this.getHeaders(token, headers),
      body,
      timeout,
    });
  }

  protected async delete<T>(
    args: IMainApiRequestArgs,
  ): Promise<IGenericHttpResponse<T>> {
    const { token = null, headers, body, pathParams, queries, timeout } = args;
    return this.genericHttp.delete({
      url: this.getUrl(pathParams, queries),
      headers: this.getHeaders(token, headers),
      body,
      timeout,
    });
  }

  private getUrl(
    pathParams: string[],
    queries: Record<string, string>,
  ): string {
    return urlHelper.construct(
      {
        base: this.baseUrl,
        params: pathParams,
        queries: queries,
      },
      { shouldSkipMissingArgs: true },
    );
  }

  private getHeaders(token: string, headers: Record<string, string>) {
    return { authorization: token, ...headers };
  }
}
