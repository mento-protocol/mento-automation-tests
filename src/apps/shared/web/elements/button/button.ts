import { Locator } from "@playwright/test";
import { BaseElement, IButton } from "../index";

export class Button extends BaseElement implements IButton {
  constructor(protected override _element: Locator) {
    super(_element);
  }
}
