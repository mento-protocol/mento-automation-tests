import { ElementSearcher } from "@helpers/element-finder/types/index.types";
import { BasePe } from "@page-elements/base/base.pe";
import { ButtonInterface } from "@page-elements/button/button.types";

export class Button extends BasePe implements ButtonInterface {
  constructor(protected override elementSearcher: ElementSearcher) {
    super(elementSearcher);
  }
}
