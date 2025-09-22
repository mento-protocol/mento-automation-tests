import { BaseService, IBaseServiceArgs } from "@shared/web/base/base.service";
import { ClassLog } from "@decorators/logger.decorators";
import { IGetConfirmationPopup, VotingPowerPage } from "./voting-power.page";
import { waiterHelper } from "@helpers/waiter/waiter.helper";
import { timeouts } from "@constants/index";
import { expect } from "@fixtures/test.fixture";
import { loggerHelper } from "@helpers/logger/logger.helper";
import { UpdateLockModalPage } from "./update-lock-modal.page";

const log = loggerHelper.get("VotingPowerService");

@ClassLog
export class VotingPowerService extends BaseService {
  public override page: VotingPowerPage = null;
  public updateLockModalPage: UpdateLockModalPage = null;

  constructor(args: IVotingPowerServiceArgs) {
    const { page, updateLockModalPage } = args;
    super(args);
    this.page = page;
    this.updateLockModalPage = updateLockModalPage;
  }

  async createLock({
    lockAmount,
    shouldExtendPeriod = false,
  }: ICreateLockArgs): Promise<void> {
    await waiterHelper.waitForAnimation();
    await this.page.lockAmountInput.enterText(lockAmount);
    await this.page.enterAmountButton.waitForDisappeared(timeouts.xs);
    if (shouldExtendPeriod) {
      await this.page.lockPeriodSlider.dragTo({
        target: this.page.maxAmountButton.element,
      });
    }
    await this.handleLockAction(LockAction.create);
  }

  async updateLock({
    lockAmount,
    lockIndex = 0,
    shouldExtendPeriod = false,
  }: IUpdateLockArgs): Promise<void> {
    const action = shouldExtendPeriod
      ? LockAction.topUpAndExtend
      : LockAction.topUp;

    await this.openExistingLockByIndex(lockIndex);
    await this.updateLockModalPage.amountInput.enterText(lockAmount);
    await this.updateLockModalPage.enterAmountButton.waitForDisappeared(
      timeouts.xs,
    );
    if (shouldExtendPeriod) {
      await this.updateLockModalPage.lockPeriodSlider.dragTo({
        target: this.updateLockModalPage.receiveVeMentoLabel.element,
      });
    }
    await this.handleLockAction(action);
  }

  async openExistingLockByIndex(lockIndex: number): Promise<void> {
    await this.page.getExistingLockByIndex(lockIndex).click();
    await this.updateLockModalPage.verifyIsOpen();
  }

  async verifyConfirmationPopup(
    toVerify: "opened" | "closed",
    confirmationPopup: IGetConfirmationPopup,
  ): Promise<void> {
    await confirmationPopup.headerLabel.waitForDisplayed(timeouts.s, {
      errorMessage: `'${await confirmationPopup.headerLabel.getText()}' confirmation popup is not ${toVerify}!`,
    });
  }

  getAllLocks() {
    return this.page.allLocks.getAll();
  }

  getAllLocksCount() {
    return this.page.allLocks.getLength();
  }

  async waitForLockValues(): Promise<boolean> {
    return waiterHelper.wait(
      async () => {
        const { veMento: currentVeMento, mento: currentMento } =
          await this.getCurrentLockValues();
        return currentVeMento !== 0 && currentMento !== 0;
      },
      timeouts.s,
      {
        errorMessage: "Lock values are not displayed!",
      },
    );
  }

  async waitForLocksToDisplay(): Promise<boolean> {
    return waiterHelper.wait(
      async () => {
        return this.page.getExistingLockByIndex(0).isDisplayed();
      },
      timeouts.m,
      {
        errorMessage: "No locks displayed!",
      },
    );
  }

  async waitForLockValuesToChange({
    initialVeMento,
    initialMento,
  }: {
    initialVeMento: number;
    initialMento: number;
  }): Promise<boolean> {
    return waiterHelper.retry(
      async () => {
        const { veMento: currentVeMento, mento: currentMento } =
          await this.getCurrentLockValues();
        return (
          currentVeMento !== initialVeMento && currentMento !== initialMento
        );
      },
      3,
      {
        errorMessage: "Lock values are not changed!",
        interval: timeouts.xs,
        throwError: false,
      },
    );
  }

  async getCurrentLockValues(): Promise<{ veMento: number; mento: number }> {
    const veMentoValueText =
      await this.page.locksSummary.totalVeMentoLabel.getText();
    const mentoValueText =
      await this.page.locksSummary.totalLockedMentoLabel.getText();
    return {
      veMento: Number(veMentoValueText.replace(/,/g, "")),
      mento: Number(mentoValueText.replace(/,/g, "")),
    };
  }

  async getReceiveVeMento(): Promise<number> {
    return Number(
      (await this.page.veMentoReceiveLabel.getText()).replace(/ veMENTO/g, ""),
    );
  }

  private async handleLockAction(action: LockAction) {
    const { actionButton, successNotificationLabel, confirmationPopup } =
      this.getKeyElementsByAction(action);
    const shouldApprove = await this.shouldApprove(action);

    if (shouldApprove) {
      log.debug(`Approving mento first to be able to '${action}' lock`);
      await this.approveLock(confirmationPopup);
      await this.verifyConfirmationPopup("opened", confirmationPopup);
      log.debug(`Executing '${action}' lock after approving mento`);
      await this.confirmLockAction(confirmationPopup);
    } else {
      log.debug(`Executing '${action}' lock directly - approval not required`);
      await actionButton.click();
      await this.verifyConfirmationPopup("opened", confirmationPopup);
      await this.confirmLockAction(confirmationPopup);
    }

    expect
      .soft(
        await successNotificationLabel.waitForDisplayed(timeouts.xl, {
          errorMessage: `${action} success notification is not displayed!`,
          throwError: false,
        }),
      )
      .toBeTruthy();
  }

  private async shouldApprove(action: LockAction): Promise<boolean> {
    const { page } = this.getKeyElementsByAction(action);
    return await page.approveMentoButton.waitForDisplayed(timeouts.xs, {
      errorMessage: `${page.approveMentoButton.name} is not there!`,
      throwError: false,
    });
  }

  private async confirmLockAction(
    confirmationPopup: IGetConfirmationPopup,
  ): Promise<void> {
    await confirmationPopup.actionLabel.waitForDisplayed(timeouts.s);
    await confirmationPopup.todoActionLabel.waitForDisplayed(timeouts.xs);
    await this.metamask.rawModule.confirmTransaction();
    await this.verifyConfirmationPopup("closed", confirmationPopup);
  }

  private async approveLock(
    confirmationPopup: IGetConfirmationPopup,
  ): Promise<void> {
    await this.page.approveMentoButton.click();
    await this.verifyConfirmationPopup("opened", confirmationPopup);
    await this.metamask.rawModule.confirmTransaction();
    await waiterHelper.waitForAnimation();
    // await waiterHelper.sleep(timeouts.xxxs, {
    //   sleepReason: "Waiting for next TX to confirm",
    // });
    await this.metamask.rawModule.confirmTransaction();
  }

  private getKeyElementsByAction(action: LockAction) {
    return {
      page: action === LockAction.create ? this.page : this.updateLockModalPage,
      actionButton: this.getActionButton(action),
      successNotificationLabel:
        action === LockAction.create
          ? this.page.createLockSuccessfullyNotificationLabel
          : this.page.updateLockSuccessfullyNotificationLabel,
      confirmationPopup: this.page.getConfirmationPopup(action),
    };
  }

  private getActionButton(action: LockAction) {
    return {
      [LockAction.create]: this.page.lockMentoButton,
      [LockAction.topUp]: this.updateLockModalPage.topUpLockButton,
      [LockAction.topUpAndExtend]:
        this.updateLockModalPage.topUpAndExtendLockButton,
    }[action];
  }
}

interface IVotingPowerServiceArgs extends IBaseServiceArgs {
  page: VotingPowerPage;
  updateLockModalPage: UpdateLockModalPage;
}

export enum LockAction {
  create = "create",
  // update = "update",
  topUp = "topUp",
  topUpAndExtend = "topUpAndExtend",
}

interface ICreateLockArgs {
  lockAmount: string;
  shouldExtendPeriod?: boolean;
}

interface IUpdateLockArgs {
  lockAmount: string;
  lockIndex?: number;
  shouldExtendPeriod?: boolean;
}
