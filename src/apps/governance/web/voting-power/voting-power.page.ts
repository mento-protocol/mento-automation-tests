import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { Button, ElementsList, Input, Label } from "@shared/web/elements/index";
import { BasePage } from "@shared/web/base/base.page";
import { LockAction } from "./voting-power.service";

export class VotingPowerPage extends BasePage {
  constructor(protected override ef: ElementFinderHelper) {
    super(ef);
  }

  headerLabel = new Label(this.ef.dataTestId("yourVotingPowerTitleLabel"));

  maxAmountButton = new Button(this.ef.role("button", { name: "MAX" }));
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

  lockPeriodSlider = new Button(this.ef.role("slider"));

  staticElements = [this.headerLabel];

  getExistingLockByIndex(index: number) {
    return new Button(this.ef.dataTestId(`lockCard_${index}`));
  }

  getConfirmationPopup(action: LockAction): IGetConfirmationPopup {
    const headerLabel = action === LockAction.create ? "Create" : "Update";
    const actionLabel = this.getActionLabel(action);
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

  private getActionLabel(action: LockAction): string {
    return {
      [LockAction.create]: "Lock MENTO",
      [LockAction.topUp]: "Top-up lock",
      [LockAction.topUpAndExtend]: "Top-up and extend lock",
    }[action];
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
