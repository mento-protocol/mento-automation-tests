import { BaseElementFinderInterface } from "@helpers/element-finder/types/base-element-finder.types";
import { IElementSearcher } from "@helpers/element-finder/types/index.types";
import { ElementsFinderHelper } from "@helpers/element-finder/elements-finder.helper";

export interface ElementFinderInterface
  extends BaseElementFinderInterface<IElementSearcher> {
  all: ElementsFinderHelper;
}
