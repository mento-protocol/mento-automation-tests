import { loggerHelper } from "@helpers/logger/logger.helper";
import { BaseController } from "@api/controllers/base.controller";
import {
  AuthOptionType,
  IAuthController,
  IGetToken,
} from "./auth.controller.types";
import { GenericHttpClient } from "@api/http/generic-http.client";
import { IUserCredentials } from "@api/http/http.types";
import { primitiveHelper } from "@helpers/primitive/primitive.helper";

const logger = loggerHelper.get("Auth-Api-Client");

export class AuthController extends BaseController implements IAuthController {
  private readonly relativeUrl = "auth/token";
  private readonly tokens = {};
  constructor(genericApi: GenericHttpClient) {
    super(genericApi);
  }

  async getTokenByAuthOption(authOption: AuthOptionType): Promise<string> {
    if (!this.isValidOption(authOption)) {
      throw new Error(
        `Invalid auth option: ${primitiveHelper.jsonStringify(authOption)}`,
      );
    }

    const token = this.isToken(authOption)
      ? authOption
      : await this.getTokenByUser(authOption as IUserCredentials);

    return `Bearer ${token}`;
  }

  private async getTokenByUser(user: IUserCredentials): Promise<string> {
    if (!user) {
      throw new Error("User is not passed - token can't be gotten");
    }
    const { login, password } = user;

    if (this.tokens[login]) {
      logger.debug(`Taking existing token by email: ${login}`);
      return this.tokens[login];
    }

    this.tokens[login] = (
      await this.post<IGetToken>({
        pathParams: [this.relativeUrl],
        body: { login, password },
      })
    ).data.token;

    return this.tokens[login];
  }

  private isValidOption(authOption: AuthOptionType): boolean {
    return this.isToken(authOption) || this.isUserCredentials(authOption);
  }

  private isToken(authOption: AuthOptionType): boolean {
    return typeof authOption === "string" && authOption.length > 0;
  }

  private isUserCredentials(authOption: AuthOptionType): boolean {
    if (typeof authOption !== "object") {
      return false;
    }
    return Boolean(authOption?.login && authOption?.password);
  }
}
