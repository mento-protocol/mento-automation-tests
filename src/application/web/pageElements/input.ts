import { BaseElementPe } from "./base-element.pe";
import { IElementSearcher } from "@helpers/element-finder/types/index.types";
import { IInput } from "./types/input.types";

export class Input extends BaseElementPe implements IInput {
  constructor(protected override elementSearcher: IElementSearcher) {
    super(elementSearcher);
  }

  async enterText(text: string, options?): Promise<void> {
    return (await this.element).fill(text, options);
  }
}
