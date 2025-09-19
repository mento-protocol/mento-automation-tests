import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { Button, ElementsList, Input, Label } from "@shared/web/elements/index";
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
  mentoApprovalConfirmedNotificationLabel = new Label(
    this.ef.text("MENTO approval confirmed"),
  );
  createLockSuccessfullyNotificationLabel = new Label(
    this.ef.text("MENTO locked successfully"),
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

  allLocks = new ElementsList(
    Button,
    this.ef.dataTestId(`lockCard_`, { exact: false }),
  );

  getExistingLockByIndex(index: number) {
    return new Button(this.ef.dataTestId(`lockCard_${index}`));
  }

  staticElements = [this.headerLabel];

  getConfirmationPopup(isCreate: boolean): IGetConfirmationPopup {
    const headerLabel = isCreate ? "Create" : "Update";
    const actionLabel = isCreate ? "Lock MENTO" : "Top-up lock";
    const headerLabelLocator = `${headerLabel} Lock`;
    return {
      headerLabel: new Label(
        this.ef.role("dialog", { name: headerLabelLocator }),
      ),
      actionLabel: new Label(
        this.ef.label(headerLabelLocator).getByText(actionLabel),
      ),
      approveMentoLabel: new Label(this.ef.text("Approve MENTO")),
      rejectedLabel: new Label(
        this.ef.role("dialog", { name: "Transaction was rejected" }),
      ),
      todoActionLabel: new Label(
        this.ef.label(headerLabelLocator).getByText("Continue in wallet"),
      ),
      confirmingLabel: new Label(
        this.ef.role("dialog", { name: "Confirming..." }),
      ),
    };
  }
}

export interface IGetConfirmationPopup {
  headerLabel: Label;
  actionLabel: Label;
  approveMentoLabel: Label;
  rejectedLabel: Label;
  todoActionLabel: Label;
  confirmingLabel: Label;
}
