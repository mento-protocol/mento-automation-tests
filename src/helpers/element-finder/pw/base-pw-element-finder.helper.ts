import { Page } from "@playwright/test";

import {
  IBaseElementFinderArgs,
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

  role(role: string, options?, esOptions?) {
    // make enum here for PwMethodName
    return this.search({
      pwMethodName: "getByRole",
      pwMethodArgs: [role, options],
      esOptions,
    });
  }

  text(text: string, options?: Record<string, unknown>, esOptions?) {
    // make enum here for PwMethodName
    return this.search({
      pwMethodName: "getByText",
      pwMethodArgs: [text, options],
      esOptions,
    });
  }
}
