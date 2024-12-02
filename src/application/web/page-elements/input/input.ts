import { IElementSearcher } from "@helpers/element-finder/types/index.types";
import { BasePe, IInput } from "@page-elements/index";

export class Input extends BasePe implements IInput {
  constructor(protected override elementSearcher: IElementSearcher) {
    super(elementSearcher);
  }

  async enterText(text: string, options?: { timeout: number }): Promise<void> {
    return (await this.element).fill(text, options);
  }
}
