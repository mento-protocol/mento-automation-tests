import { ElementSearcher } from "@helpers/element-finder/types/index.types";
import { BasePe, IButton } from "@page-elements/index";

export class Button extends BasePe implements IButton {
  constructor(protected override elementSearcher: ElementSearcher) {
    super(elementSearcher);
  }
}
