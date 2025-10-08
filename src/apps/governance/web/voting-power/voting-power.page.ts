import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { Button, Input, Label } from "@shared/web/elements/index";
import { BasePage } from "@shared/web/base/base.page";

export class VotingPowerPage extends BasePage {
  constructor(protected override ef: ElementFinderHelper) {
    super(ef);
  }

  headerLabel = new Label(this.ef.dataTestId("yourVotingPowerTitleLabel"));

  // TODO: Should be specified as "lockAmountInput"
  lockAmountInput = new Input(this.ef.dataTestId("sellAmountInput"));
  datepickerButton = new Button(this.ef.dataTestId("datepickerButton"));

  enterAmountButton = new Button(this.ef.dataTestId("enterAmountButton"));
  insufficientBalanceButton = new Button(
    this.ef.dataTestId("insufficientBalanceButton"),
  );
  approveMentoButton = new Button(this.ef.dataTestId("approveMentoButton"));
  topUpLockButton = new Button(this.ef.dataTestId("topUpLockButton"));
  extendLockButton = new Button(this.ef.dataTestId("extendLockButton"));
  topUpAndExtendLockButton = new Button(
    this.ef.dataTestId("topUpAndExtendLockButton"),
  );

  // actionButton = new Button(this.ef.pw.dataTestId("actionButton"));

  lockUpdatedSuccessfullyNotificationLabel = new Label(
    this.ef.text("Lock updated successfully"),
  );
  veMentoReceiveLabel = new Label(this.ef.dataTestId("veMentoReceiveLabel"));

  existingLock = {
    veMentoLabel: new Label(this.ef.dataTestId("existingLockVeMentoLabel")),
    mentoLabel: new Label(this.ef.dataTestId("existingLockMentoLabel")),
    withdrawableMentoLabel: new Label(
      this.ef.dataTestId("existingLockWithdrawableMentoLabel"),
    ),
    expirationDateLabel: new Label(
      this.ef.dataTestId("existingLockExpirationDateLabel"),
    ),
  };

  actionPopup = {
    continueInWalletLabel: new Label(this.ef.text("Continue in wallet")),
    confirmingLabel: new Label(this.ef.text("Confirming...")),
  };

  staticElements = [this.headerLabel];
}
