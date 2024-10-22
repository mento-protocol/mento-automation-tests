import { Locator } from "@playwright/test";

import { ElementFinderHelper } from "./element-finder.helper";
import {
  IElementsFinderArgs,
  IElementsSearcher,
  FindElement,
} from "./types/index.types";
import { BaseElementFinderHelper } from "@helpers/element-finder/base-element-finder.helper";
import { ElementsFinderInterface } from "@helpers/element-finder/types/elements-finder.types";

export class ElementsFinderHelper
  extends BaseElementFinderHelper<IElementsSearcher>
  implements ElementsFinderInterface
{
  private readonly searchRoot: FindElement = null;

  constructor(params: IElementsFinderArgs) {
    super(params);
    const { searchRoot } = params;
    this.searchRoot = searchRoot;
  }

  protected search(locator: string): IElementsSearcher {
    const findElements = async (): Promise<Locator[]> => {
      const root = this.searchRoot ? await this.searchRoot() : this.page;
      return root.locator(locator).all();
    };

    const getElementByIndex = (index: number) => {
      async function findElement() {
        return (await findElements())[index];
      }

      const nested = (): ElementFinderHelper => {
        return new ElementFinderHelper({
          searchRoot: () => findElement(),
          page: this.page,
        });
      };
      return {
        findElement,
        nested,
        locator: `${locator}[${index}]`,
      };
    };
    return {
      findElements,
      getElementByIndex,
    };
  }
}
