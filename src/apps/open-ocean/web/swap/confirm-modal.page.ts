import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { Button, Label } from "@shared/web/elements/index";
import { BasePage } from "@shared/web/base/base.page";

export class ConfirmModalPage extends BasePage {
  constructor(protected override ef: ElementFinderHelper) {
    super(ef);
  }

  headerLabel = new Label(this.ef.text("Confirm"));

  confirmOrderButton = new Button(this.ef.text("Confirm Order"));

  congratulationsLabel = new Label(this.ef.text("Congratulations!"));

  congratulationsMessageLabel = new Label(
    this.ef.text("Now you can view your transaction in your wallet."),
  );

  staticElements = [this.headerLabel, this.confirmOrderButton];
}
