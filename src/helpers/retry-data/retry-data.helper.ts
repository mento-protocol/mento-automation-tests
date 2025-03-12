import fs from "fs";

import { magicStrings } from "@constants/magic-strings.constants";
import { IRetryDataHelper } from "@helpers/retry-data/retry-data.helper.types";
import { Token } from "@constants/token.constants";
import { primitiveHelper } from "@helpers/primitive/primitive.helper";

class RetryDataHelper implements IRetryDataHelper {
  private readonly retryFolderPath = `${magicStrings.path.artifacts}/retries`;

  create(data: Record<string, unknown>, retryName: string): void {
    !fs.existsSync(`${this.retryFolderPath}`) &&
      fs.mkdirSync(`${magicStrings.path.artifacts}/retries`);
    fs.writeFileSync(
      `${this.retryFolderPath}/${retryName}.json`,
      JSON.stringify(data),
    );
  }

  getByName<R>(retryName: string): Record<string, R> {
    return JSON.parse(
      fs.readFileSync(`${this.retryFolderPath}/${retryName}.json`)?.toString(),
    );
  }

  isExistByName(retryName: string): boolean {
    return fs.existsSync(`${this.retryFolderPath}/${retryName}.json`);
  }

  getRandomToken(fromToken: Token, toTokens: Token[]): Token {
    if (!retryDataHelper.isExistByName(fromToken)) {
      const randomToken = primitiveHelper.getRandomFrom(toTokens);
      retryDataHelper.create({ fromToken, toToken: randomToken }, fromToken);
      return randomToken;
    }
    return retryDataHelper.getByName<Token>(fromToken).toToken;
  }
}

export const retryDataHelper = new RetryDataHelper();
