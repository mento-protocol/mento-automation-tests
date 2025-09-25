export interface IGraphQLRequestArgs {
  url: string;
  query: string;
  variables?: Record<string, unknown>;
  operationName?: string;
  headers?: Record<string, string>;
  timeout?: number;
}

export interface IGraphQLResponse<T> {
  data: T;
  errors?: Array<{
    message: string;
    locations?: Array<{
      line: number;
      column: number;
    }>;
    path?: Array<string | number>;
    extensions?: Record<string, unknown>;
  }>;
  headers: Record<string, string>;
  status: number;
}

export interface IGraphQLError {
  message: string;
  locations?: Array<{
    line: number;
    column: number;
  }>;
  path?: Array<string | number>;
  extensions?: Record<string, unknown>;
}

export interface IGraphQLRequestBody {
  query: string;
  variables?: Record<string, unknown>;
  operationName?: string;
}
