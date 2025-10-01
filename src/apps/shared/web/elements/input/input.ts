import { Locator } from "@playwright/test";

import { BaseElement, IInput } from "../index";

export class Input extends BaseElement implements IInput {
  constructor(protected override _element: Locator) {
    super(_element);
  }

  async enterText(
    text: string,
    options: { timeout?: number; force?: boolean } = {},
  ): Promise<void> {
    return this.element.fill(text, options);
  }
}
