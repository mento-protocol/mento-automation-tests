import { ElementSearcher } from "@helpers/element-finder/types/index.types";
import { BaseElement, ILabel } from "../index";

export class Label extends BaseElement implements ILabel {
  constructor(protected override elementSearcher: ElementSearcher) {
    super(elementSearcher);
  }
}
