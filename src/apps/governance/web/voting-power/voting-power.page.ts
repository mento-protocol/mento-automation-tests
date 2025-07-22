import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { Button, Input, Label } from "@shared/web/elements/index";
import { BasePage } from "@shared/web/base/base.page";

export class VotingPowerPage extends BasePage {
  constructor(protected override ef: ElementFinderHelper) {
    super(ef);
  }

  headerLabel = new Label(this.ef.pw.dataTestId("yourVotingPowerTitleLabel"));

  // TODO: Should be specified as "lockAmountInput"
  lockAmountInput = new Input(this.ef.pw.dataTestId("sellAmountInput"));
  datepickerButton = new Button(this.ef.pw.dataTestId("datepickerButton"));

  enterAmountButton = new Button(this.ef.pw.dataTestId("enterAmountButton"));
  insufficientBalanceButton = new Button(
    this.ef.pw.dataTestId("insufficientBalanceButton"),
  );
  approveMentoButton = new Button(this.ef.pw.dataTestId("approveMentoButton"));
  topUpLockButton = new Button(this.ef.pw.dataTestId("topUpLockButton"));
  extendLockButton = new Button(this.ef.pw.dataTestId("extendLockButton"));
  topUpAndExtendLockButton = new Button(
    this.ef.pw.dataTestId("topUpAndExtendLockButton"),
  );

  // actionButton = new Button(this.ef.pw.dataTestId("actionButton"));

  topUpLockPopupDescriptionLabel = new Label(
    this.ef.pw.text("Continue in wallet"),
  );

  staticElements = [this.headerLabel];
}
