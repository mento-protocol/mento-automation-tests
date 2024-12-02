import { Page } from "@playwright/test";

import {
  IBaseElementFinderArgs,
  IElementSearchOptions,
  IPwElementSearcher,
} from "@helpers/element-finder/types/index.types";
import { IPwSearchArgs } from "@helpers/element-finder/pw/pw-element-finder.helper";

export interface IBasePwElementFinderHelper {
  role: (
    role: string,
    options?: Record<string, unknown>,
    esOptions?: IElementSearchOptions,
  ) => IPwElementSearcher;
  text: (
    role: string,
    options?: Record<string, unknown>,
    esOptions?: IElementSearchOptions,
  ) => IPwElementSearcher;
}

export abstract class BasePwElementFinderHelper
  implements IBasePwElementFinderHelper
{
  protected page: Page = null;

  protected constructor(params: IBaseElementFinderArgs) {
    const { page } = params;
    this.page = page;
  }

  protected abstract search(args: IPwSearchArgs): IPwElementSearcher;

  role(
    role: string,
    options?: Record<string, unknown>,
    esOptions?: IElementSearchOptions,
  ): IPwElementSearcher {
    return this.search({
      pwMethod: { name: PwMethodName.getByRole, args: [role, options] },
      esOptions,
    });
  }

  text(
    text: string,
    options?: Record<string, unknown>,
    esOptions?: IElementSearchOptions,
  ): IPwElementSearcher {
    return this.search({
      pwMethod: { name: PwMethodName.getByText, args: [text, options] },
      esOptions,
    });
  }
}

export enum PwMethodName {
  getByRole = "getByRole",
  getByText = "getByText",
}
