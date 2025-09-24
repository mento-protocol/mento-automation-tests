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
  delegateCheckbox = new Button(this.ef.text("Delegate", { exact: true }));
  delegateAddressInput = new Input(this.ef.dataTestId("delegateAddressInput"));
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

  allLockCards = new ElementsList(
    Label,
    this.ef.dataTestId(`lockCard_`, { exact: false }),
  );

  lockPeriodSlider = new Button(this.ef.role("slider"));

  staticElements = [this.headerLabel];

  async getAllLocks(): Promise<ILock[]> {
    const allLockCards = await this.allLockCards.getAll();
    return allLockCards.map(root => {
      return {
        root,
        updateButton: new Button(
          root.element.locator(this.ef.dataTestId("updateLockButton")),
        ),
        badgeLabel: new Label(
          root.element.locator(this.ef.dataTestId("lockCardBadge")),
        ),
      };
    });
  }

  async filterLocksByType(type: LockType, allLocks: ILock[]): Promise<ILock[]> {
    const filteredLocks: ILock[] = [];
    for (const lock of allLocks) {
      const badgeLabel = await lock.badgeLabel.getText();
      badgeLabel === type && filteredLocks.push(lock);
    }
    return filteredLocks;
  }

  async getCurrentLockByIndex(index: number): Promise<ILock> {
    const root = new Label(this.ef.dataTestId(`lockCard_${index}`));
    return {
      root,
      updateButton: new Button(
        root.element.locator(this.ef.dataTestId("updateLockButton")),
      ),
      badgeLabel: new Label(
        root.element.locator(this.ef.dataTestId("lockCardBadge")),
      ),
    };
  }

  async getCurrentLockByLockType(
    lockType: "Delegated" | "Personal",
  ): Promise<ILock> {
    const allLocks = await this.getAllLocks();
    const lock = allLocks.find(
      async lock => (await lock.badgeLabel.getText()) === lockType,
    );

    return {
      root: lock.root,
      updateButton: lock.updateButton,
      badgeLabel: lock.badgeLabel,
    };
  }

  async getCurrentLock({ index, type }: IGetCurrentLockParams): Promise<ILock> {
    const allLocks = await this.getAllLocks();
    const filteredLocks = await this.filterLocksByType(type, allLocks);
    const lock = filteredLocks[index];
    return {
      root: lock.root,
      updateButton: lock.updateButton,
      badgeLabel: lock.badgeLabel,
    };
  }

  getConfirmationPopup(action: LockAction): IGetConfirmationPopup {
    const isCreate = action === LockAction.create;
    const headerLabelText = isCreate ? "Create" : "Update";
    const headerLabel = new Label(
      this.ef.role("dialog", { name: `${headerLabelText} Lock` }),
    );
    return {
      headerLabel,
      actionLabel: new Label(
        headerLabel.locator(
          isCreate
            ? this.ef.text("Lock MENTO")
            : this.ef.dataTestId("actionLabel", { exact: true }),
        ),
      ),
      approveMentoLabel: new Label(this.ef.text("Approve MENTO")),
      rejectedLabel: new Label(
        this.ef.role("dialog", { name: "Transaction was rejected" }),
      ),
      todoActionLabel: new Label(
        headerLabel.locator(this.ef.text("Continue in wallet")),
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

interface IGetCurrentLockParams {
  index: number;
  type: LockType;
}

export interface ILock {
  root: Label;
  updateButton: Button;
  badgeLabel: Label;
}

export enum LockType {
  Personal = "Personal",
  Delegated = "Delegated",
  Received = "Received",
}
