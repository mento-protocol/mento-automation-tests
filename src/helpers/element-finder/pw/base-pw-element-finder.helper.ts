import { Page } from "@playwright/test";

import {
  IBaseElementFinderArgs,
  IElementSearchOptions,
  IPwElementSearcher,
} from "@helpers/element-finder/types/index.types";
import { IPwSearchArgs } from "@helpers/element-finder/pw/pw-element-finder.helper";

export abstract class BasePwElementFinderHelper {
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

  dataTestId(
    dataTestId: string,
    options?: Record<string, unknown>,
    esOptions?: IElementSearchOptions,
  ): IPwElementSearcher {
    return this.search({
      pwMethod: { name: PwMethodName.getByTestId, args: [dataTestId, options] },
      esOptions,
    });
  }

  label(
    label: string,
    options?: Record<string, unknown>,
    esOptions?: IElementSearchOptions,
  ): IPwElementSearcher {
    return this.search({
      pwMethod: { name: PwMethodName.getByLabel, args: [label, options] },
      esOptions,
    });
  }
}

export enum PwMethodName {
  getByRole = "getByRole",
  getByText = "getByText",
  getByTestId = "getByTestId",
  getByLabel = "getByLabel",
}
