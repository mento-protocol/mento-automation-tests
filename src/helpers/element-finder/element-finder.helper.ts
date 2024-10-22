import { ElementsFinderHelper } from "./elements-finder.helper";
import {
  IElementFinderArgs,
  IElementSearcher,
  IElementSearchOptions,
  FindElement,
} from "./types/index.types";
import { Locator } from "@playwright/test";
import { BaseElementFinderHelper } from "@helpers/element-finder/base-element-finder.helper";
import { ElementFinderInterface } from "@helpers/element-finder/types/element-finder.types";
import { PwElementFinderHelper } from "@helpers/element-finder/pw/pw-element-finder.helper";

export class ElementFinderHelper
  extends BaseElementFinderHelper<IElementSearcher>
  implements ElementFinderInterface
{
  private readonly searchRoot: FindElement = null;

  constructor(params: IElementFinderArgs) {
    super(params);
    const { searchRoot } = params;
    this.searchRoot = searchRoot;
  }

  get all(): ElementsFinderHelper {
    return new ElementsFinderHelper({
      page: this.page,
      searchRoot: this.searchRoot,
    });
  }

  get pw(): PwElementFinderHelper {
    return new PwElementFinderHelper({
      page: this.page,
      searchRoot: this.searchRoot,
    });
  }

  protected search(
    locator: string,
    options: IElementSearchOptions = {},
  ): IElementSearcher {
    const { takeFirstElement, frameLocator } = options;
    const findElement = async (): Promise<Locator> => {
      const root = this.searchRoot ? await this.searchRoot() : this.page;
      const element =
        frameLocator?.length > 0
          ? root.frameLocator(frameLocator).locator(locator)
          : root.locator(locator);
      return takeFirstElement ? element.first() : element;
    };
    const nested = (): ElementFinderInterface => {
      return new ElementFinderHelper({
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
