import { Locator } from "@playwright/test";
import { BaseElement, IButton } from "../index";

export class Button extends BaseElement implements IButton {
  constructor(protected override element: Locator) {
    super(element);
  }
}
