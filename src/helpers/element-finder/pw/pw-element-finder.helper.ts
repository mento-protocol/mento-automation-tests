import { Locator } from "@playwright/test";

import {
  FindElement,
  IElementSearchOptions,
  IPwElementFinderArgs,
  IPwElementSearcher,
} from "@helpers/element-finder/types/index.types";
import {
  BasePwElementFinderHelper,
  PwMethodName,
} from "@helpers/element-finder/pw/base-pw-element-finder.helper";

export class PwElementFinderHelper extends BasePwElementFinderHelper {
  protected readonly searchRoot: FindElement = null;

  constructor(args: IPwElementFinderArgs) {
    const { searchRoot } = args;
    super(args);
    this.searchRoot = searchRoot;
  }

  protected search(args: IPwSearchArgs): IPwElementSearcher {
    const { pwMethod, esOptions = {} } = args;
    const { takeFirstElement, frameLocator } = esOptions;
    const locator = `${pwMethod.name}(${pwMethod.args})`;

    const findElement = async (): Promise<Locator> => {
      const root = this.searchRoot ? await this.searchRoot() : this.page;
      const element: Locator = frameLocator
        ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          root.frameLocator(frameLocator)[pwMethod.name](...pwMethod.args)
        : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          root[pwMethod.name](...pwMethod.args);
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
  pwMethod: IPwMethod;
  customMethod?: string;
  esOptions?: IElementSearchOptions;
}

export interface IPwMethod {
  name: PwMethodName;
  args: unknown[];
}
