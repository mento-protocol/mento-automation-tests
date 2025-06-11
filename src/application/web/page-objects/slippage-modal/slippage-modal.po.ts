import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { Button, Input, Label } from "@page-elements/index";
import { BasePo } from "@page-objects/index";

export class SlippageModalPo extends BasePo {
  constructor(protected override ef: ElementFinderHelper) {
    super(ef);
  }

  headerLabel = new Label(this.ef.pw.text("Slippage Tolerance"));
  closeButton = new Button(this.ef.pw.text("Close"));
  confirmButton = new Button(this.ef.pw.text("Confirm"));
  customSlippageInput = new Input(this.ef.dataTestId("customSlippageInput"));
  slippageButtons = {
    "0.5%": new Button(this.ef.dataTestId("slippageOption_0.5")),
    "1.0%": new Button(this.ef.dataTestId("slippageOption_1.0")),
    "1.5%": new Button(this.ef.dataTestId("slippageOption_1.5")),
  };

  staticElements = [this.headerLabel];
}
