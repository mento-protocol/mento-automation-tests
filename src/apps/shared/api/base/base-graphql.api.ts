import { GraphQLClient } from "@helpers/api/graphql/graphql.client";
import { envHelper } from "@helpers/env/env.helper";
import { IGraphQLResponse } from "@helpers/api/graphql/graphql.types";

export abstract class BaseGraphqlApi {
  private readonly graphqlClient: GraphQLClient = null;
  private readonly baseUrl = envHelper.getBaseApiUrl();

  protected constructor(graphqlClient: GraphQLClient) {
    this.graphqlClient = graphqlClient;
  }

  protected abstract get defaultHeaders(): Record<string, string>;

  protected async query<T>({
    relativeUrl,
    headers,
    timeout,
    query,
    variables,
    operationName,
  }: IBaseGraphqlApiRequestArgs): Promise<IGraphQLResponse<T>> {
    return this.graphqlClient.query({
      url: `${this.baseUrl}${relativeUrl ? `/${relativeUrl}` : ""}`,
      headers: { ...this.defaultHeaders, ...headers },
      timeout,
      query,
      variables,
      operationName,
    });
  }
}

export interface IBaseGraphqlApiRequestArgs {
  query: string;
  operationName: string;
  relativeUrl?: string;
  variables?: Record<string, unknown>;
  headers?: Record<string, string>;
  timeout?: number;
}
