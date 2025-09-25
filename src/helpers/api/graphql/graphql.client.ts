import { APIRequestContext, APIResponse } from "@playwright/test";

import {
  IGraphQLRequestArgs,
  IGraphQLResponse,
  IGraphQLRequestBody,
} from "./graphql.types";
import { loggerHelper } from "@helpers/logger/logger.helper";
import { primitiveHelper } from "@helpers/primitive/primitive.helper";
import { RequestModule } from "../api.helper";

const log = loggerHelper.get("GraphQL-Client");

export class GraphQLClient {
  constructor(private readonly requestModule: RequestModule) {}

  async query<T>(args: IGraphQLRequestArgs): Promise<IGraphQLResponse<T>> {
    return this.sendRequest<T>(args);
  }

  async mutate<T>(args: IGraphQLRequestArgs): Promise<IGraphQLResponse<T>> {
    return this.sendRequest<T>(args);
  }

  private async sendRequest<T>({
    url,
    query,
    operationName,
    variables = {},
    headers = {},
    timeout = 0,
  }: IGraphQLRequestArgs): Promise<IGraphQLResponse<T>> {
    const requestBody: IGraphQLRequestBody = {
      query,
      variables,
      ...(operationName && { operationName }),
    };
    const request = {
      url,
      method: "POST",
      headers,
      data: requestBody,
      timeout,
    };

    log.trace(`Request: ${primitiveHelper.jsonStringify(request)}`);

    try {
      const response = await this.fetch(url, request);
      const responseHeaders = response.headers();
      let responseData = null;

      try {
        responseData = await response.json();
      } catch {
        responseData = await response.text();
      }

      const graphqlResponse: IGraphQLResponse<T> = {
        data: responseData.data,
        errors: responseData.errors,
        headers: responseHeaders,
        status: response.status(),
      };

      if (responseData.errors) {
        log.warn(
          `GraphQL Response contains errors: ${primitiveHelper.jsonStringify(
            responseData.errors,
          )}`,
        );
      }

      return graphqlResponse;
    } catch (error) {
      const errorMessage = `Failed to send GraphQL request or handle response.\nRequest: ${primitiveHelper.jsonStringify(
        request,
      )}\nError: ${error.message}`;
      log.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  private async fetch(url: string, request): Promise<APIResponse> {
    return this.requestModule instanceof Promise
      ? await (await this.requestModule).fetch(url, request)
      : await this.requestModule.fetch(url, request);
  }
}
