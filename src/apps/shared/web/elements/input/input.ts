import { ElementSearcher } from "@helpers/element-finder/types/index.types";
import { BaseElement, IInput } from "../index";

export class Input extends BaseElement implements IInput {
  constructor(protected override elementSearcher: ElementSearcher) {
    super(elementSearcher);
  }

  async enterText(
    text: string,
    options: { timeout?: number; force?: boolean } = {},
  ): Promise<void> {
    return (await this.element).fill(text, options);
  }
}
