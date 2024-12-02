import { ElementSearcher } from "@helpers/element-finder/types/index.types";
import { BasePe, ILabel } from "@page-elements/index";

export class Label extends BasePe implements ILabel {
  constructor(protected override elementSearcher: ElementSearcher) {
    super(elementSearcher);
  }
}
