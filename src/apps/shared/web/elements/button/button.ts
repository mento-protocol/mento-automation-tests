import { ElementSearcher } from "@helpers/element-finder/types/index.types";
import { BaseElement, IButton } from "../index";

export class Button extends BaseElement implements IButton {
  constructor(protected override elementSearcher: ElementSearcher) {
    super(elementSearcher);
  }
}
