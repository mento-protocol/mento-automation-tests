import { BaseElementPe } from "./base-element.pe";
import { ElementSearcher } from "@helpers/element-finder/types/index.types";
import { ButtonInterface } from "./types/button.types";

export class Button extends BaseElementPe implements ButtonInterface {
  constructor(protected override elementSearcher: ElementSearcher) {
    super(elementSearcher);
  }
}
