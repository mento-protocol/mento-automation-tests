import { Locator } from "@playwright/test";

import { BaseElement, IInput } from "../index";
import { loggerHelper } from "@helpers/logger/logger.helper";

const log = loggerHelper.get("InputElement");

export class Input extends BaseElement implements IInput {
  constructor(protected override _element: Locator) {
    super(_element);
  }

  async enterText(
    text: number | string,
    options: { timeout?: number; force?: boolean } = {},
  ): Promise<void> {
    if (typeof text !== "number" && typeof text !== "string") {
      log.warn(
        `Invalid text passed to enter: '${text}' with type '${typeof text}'`,
      );
    }
    return this.element.fill(text.toString(), options);
  }
}
