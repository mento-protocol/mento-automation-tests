import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { Button, Input, Label } from "@shared/web/elements/index";
import { BasePage } from "@shared/web/base/base.page";

export class SlippageModalPage extends BasePage {
  constructor(protected override ef: ElementFinderHelper) {
    super(ef);
  }

  headerLabel = new Label(this.ef.text("Slippage Tolerance"));
  closeButton = new Button(this.ef.text("Close"));
  confirmButton = new Button(this.ef.text("Confirm"));
  customSlippageInput = new Input(this.ef.dataTestId("customSlippageInput"));
  slippageButtons = {
    "0.5%": new Button(this.ef.dataTestId("slippageOption_0.5")),
    "1.0%": new Button(this.ef.dataTestId("slippageOption_1.0")),
    "1.5%": new Button(this.ef.dataTestId("slippageOption_1.5")),
  };

  staticElements = [this.headerLabel];
}
