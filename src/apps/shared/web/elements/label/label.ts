import { Locator } from "@playwright/test";

import { BaseElement, ILabel } from "../index";

export class Label extends BaseElement implements ILabel {
  constructor(protected override _element: Locator) {
    super(_element);
  }
}
