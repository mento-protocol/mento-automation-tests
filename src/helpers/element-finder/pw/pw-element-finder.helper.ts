import { Locator } from "@playwright/test";

import {
  FindElement,
  IElementSearchOptions,
  IPwElementFinderArgs,
  IPwElementSearcher,
} from "@helpers/element-finder/types/index.types";
import { BasePwElementFinderHelper } from "@helpers/element-finder/pw/base-pw-element-finder.helper";

export class PwElementFinderHelper extends BasePwElementFinderHelper {
  protected readonly searchRoot: FindElement = null;

  constructor(args: IPwElementFinderArgs) {
    const { searchRoot } = args;
    super(args);
    this.searchRoot = searchRoot;
  }

  protected search(args: IPwSearchArgs): IPwElementSearcher {
    const { pwMethodName, pwMethodArgs, esOptions = {} } = args;
    const { takeFirstElement, frameLocator } = esOptions;
    let locator: string = `${pwMethodName}(${pwMethodArgs})`;
    const findElement = async (): Promise<Locator> => {
      const root = this.searchRoot ? await this.searchRoot() : this.page;
      const element: Locator =
        frameLocator?.length > 0
          ? root.frameLocator(frameLocator)[pwMethodName](...pwMethodArgs)
          : root[pwMethodName](...pwMethodArgs);
      // locator = await element.innerHTML();
      return takeFirstElement ? element.first() : element;
    };
    const nested = (): PwElementFinderHelper => {
      return new PwElementFinderHelper({
        page: this.page,
        searchRoot: () => findElement(),
      });
    };
    return {
      findElement,
      nested,
      locator,
    };
  }
}

export interface IPwSearchArgs {
  // place enum here
  pwMethodName: string;
  pwMethodArgs: unknown[];
  customMethod?: string;
  esOptions?: IElementSearchOptions;
}
