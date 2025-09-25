export interface IHttpRequestArgs {
  url: string;
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
}

export interface IHttpResponse<T> {
  data: T;
  headers: Record<string, string>;
  status: number;
}

export interface IBaseApiRequestArgs {
  relativeUrl: string;
  headers?: Record<string, string>;
  body?: unknown;
  // pathParams?: string[];
  // queries?: Record<string, string>;
  timeout?: number;
}

export interface IGetRequestError {
  request: unknown;
  error: unknown;
}

export enum ContentType {
  csv = "text/csv",
  png = "image/png",
  json = "application/json",
  multipartFormData = "multipart/form-data",
}

export interface IUserCredentials {
  login: string;
  password: string;
}

export enum Method {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}
