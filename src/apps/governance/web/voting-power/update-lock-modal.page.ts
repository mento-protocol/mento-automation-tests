import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { Button, Input, Label } from "@shared/web/elements/index";
import { BasePage } from "@shared/web/base/base.page";

export class UpdateLockModalPage extends BasePage {
  constructor(protected override ef: ElementFinderHelper) {
    super(ef);
  }

  headerLabel = new Label(this.ef.label("Update Lock #"));

  maxAmountButton = new Button(
    this.ef.role("dialog").getByRole("button", { name: "MAX" }),
  );
  amountInput = new Input(this.ef.dataTestId("updateLockAmountInput"));
  receiveVeMentoLabel = new Label(
    this.ef.dataTestId("updateLockVeMentoReceiveLabel"),
  );

  calcelButton = new Button(this.ef.text("Cancel"));
  topUpLockButton = new Button(this.ef.text("Top up lock"));
  topUpAndExtendLockButton = new Button(this.ef.text("Top up and extend lock"));
  enterAmountButton = new Button(
    this.headerLabel.locator(this.ef.dataTestId("enterAmountButton")),
  );
  approveMentoButton = new Button(this.ef.dataTestId("approveMentoButton"));
  lockPeriodSlider = new Button(this.ef.role("dialog").getByRole("slider"));

  staticElements = [this.headerLabel];
}
