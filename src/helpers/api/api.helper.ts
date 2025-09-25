import { AssemblerHelper } from "@helpers/assembler/assembler.helper";
import { APIRequestContext, request } from "@playwright/test";

import { HttpClient } from "@helpers/api/http/http-client";
import { GraphQLClient } from "@helpers/api/graphql/graphql.client";

export type RequestModule = APIRequestContext | Promise<APIRequestContext>;

export const apiHelper = new AssemblerHelper({
  httpClient: new HttpClient(request.newContext()),
  graphqlClient: new GraphQLClient(request.newContext()),
}).api();
