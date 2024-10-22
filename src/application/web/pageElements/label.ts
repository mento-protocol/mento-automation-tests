import {
  ElementSearcher,
  IElementSearcher,
} from "@helpers/element-finder/types/index.types";
import { BaseElementPe } from "./base-element.pe";
import { ILabel } from "./types/label.types";

export class Label extends BaseElementPe implements ILabel {
  constructor(protected override elementSearcher: ElementSearcher) {
    super(elementSearcher);
  }
}
