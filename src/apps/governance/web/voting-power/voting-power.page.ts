import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { Button, Input, Label } from "@shared/web/elements/index";
import { BasePage } from "@shared/web/base/base.page";

export class VotingPowerPage extends BasePage {
  constructor(protected override ef: ElementFinderHelper) {
    super(ef);
  }

  headerLabel = new Label(this.ef.dataTestId("yourVotingPowerTitleLabel"));

  lockAmountInput = new Input(this.ef.dataTestId("lockAmountInput"));
  datepickerButton = new Button(this.ef.dataTestId("datepickerButton"));

  enterAmountButton = new Button(this.ef.dataTestId("enterAmountButton"));
  insufficientBalanceButton = new Button(
    this.ef.dataTestId("insufficientBalanceButton"),
  );
  approveMentoButton = new Button(this.ef.dataTestId("approveMentoButton"));
  lockMentoButton = new Button(this.ef.dataTestId("lockMentoButton"));
  extendLockButton = new Button(this.ef.dataTestId("extendLockButton"));
  topUpAndExtendLockButton = new Button(
    this.ef.dataTestId("topUpAndExtendLockButton"),
  );

  topUpLockPopupDescriptionLabel = new Label(
    this.ef.text("Continue in wallet"),
  );
  createLockSuccessfullyNotificationLabel = new Button(
    this.ef.dataTestId("Lock created successfully"),
  );
  updateLockSuccessfullyNotificationLabel = new Label(
    this.ef.text("Lock updated successfully"),
  );
  veMentoReceiveLabel = new Label(this.ef.dataTestId("veMentoReceiveLabel"));

  locksSummary = {
    totalLockedMentoLabel: new Label(
      this.ef.dataTestId("totalLockedMentoLabel"),
    ),
    ownLocksVeMentoLabel: new Label(this.ef.dataTestId("ownLocksVeMentoLabel")),
    delegatedVeMentoLabel: new Label(
      this.ef.dataTestId("delegatedVeMentoLabel"),
    ),
    totalVeMentoLabel: new Label(this.ef.dataTestId("totalVeMentoLabel")),
    withdrawableMentoLabel: new Label(
      this.ef.dataTestId("withdrawableMentoLabel"),
    ),
  };

  getExistingLockByIndex(index: number) {
    return new Button(this.ef.dataTestId(`lock-card-${index}`));
  }

  staticElements = [this.headerLabel];
}
