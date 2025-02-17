import { BaseHttpClient } from "./base-http.client";
import {
  IBaseApiRequestArgs,
  IGenericHttpResponse,
  Method,
} from "./http.types";

export class GenericHttpClient {
  constructor(private baseHttpClient: BaseHttpClient) {}

  async get<T>(args: IBaseApiRequestArgs): Promise<IGenericHttpResponse<T>> {
    return this.baseHttpClient.sendRequest(Method.GET, args);
  }

  async post<T>(args: IBaseApiRequestArgs): Promise<IGenericHttpResponse<T>> {
    return this.baseHttpClient.sendRequest(Method.POST, args);
  }

  async put<T>(args: IBaseApiRequestArgs): Promise<IGenericHttpResponse<T>> {
    return this.baseHttpClient.sendRequest(Method.PUT, args);
  }

  async patch<T>(args: IBaseApiRequestArgs): Promise<IGenericHttpResponse<T>> {
    return this.baseHttpClient.sendRequest(Method.PATCH, args);
  }

  async delete<T>(args: IBaseApiRequestArgs): Promise<IGenericHttpResponse<T>> {
    return this.baseHttpClient.sendRequest(Method.DELETE, args);
  }
}
