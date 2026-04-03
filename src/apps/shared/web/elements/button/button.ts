import { Locator } from "@playwright/test";
import { BaseElement, IButton } from "../index";

export class Button extends BaseElement implements IButton {
  constructor(protected override _element: Locator) {
    super(_element);
  }

  async isChecked(): Promise<boolean> {
    return this._element.isChecked();
  }
}
