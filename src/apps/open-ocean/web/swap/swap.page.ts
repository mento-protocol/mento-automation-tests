import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { Button, Input } from "@shared/web/elements/index";
import { BasePage } from "@shared/web/base/base.page";

export class OpenOceanSwapPage extends BasePage {
  constructor(protected override ef: ElementFinderHelper) {
    super(ef);
  }

  private amountLocator = this.ef.raw("input[placeholder][data-v-287d9723]");

  amountInputs = {
    sell: new Input(this.amountLocator.first()),
    buy: new Input(this.amountLocator.nth(1)),
  };

  reviewButton = new Button(this.ef.text("Review"));
  swapButton = new Button(this.ef.text("Swap"));

  staticElements = [this.amountInputs.sell, this.amountInputs.buy];
}
