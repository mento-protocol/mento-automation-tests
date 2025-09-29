import { BaseService, IBaseServiceArgs } from "@shared/web/base/base.service";
import { ClassLog } from "@decorators/logger.decorators";
import {
  IGetConfirmationPopup,
  LockType,
  VotingPowerPage,
} from "./voting-power.page";
import { waiterHelper } from "@helpers/waiter/waiter.helper";
import { timeouts } from "@constants/index";
import { expect } from "@fixtures/test.fixture";
import { loggerHelper } from "@helpers/logger/logger.helper";
import { UpdateLockModalPage } from "./update-lock-modal.page";
import { Label } from "@shared/web/elements/label/label";

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
    delegateAddress,
    shouldExtendPeriod = false,
  }: ICreateLockArgs): Promise<void> {
    await waiterHelper.waitForAnimation();

    if (shouldExtendPeriod) {
      log.debug("Extending lock period");
      await this.page.lockPeriodSlider.dragTo(this.page.maxAmountButton);
    }
    if (delegateAddress?.length) {
      log.debug(`Delegating lock to: ${delegateAddress}`);
      await this.delegate(delegateAddress, { isCreate: true });
    }

    await this.page.lockAmountInput.enterText(lockAmount);
    await this.page.enterAmountButton.waitForDisappeared(timeouts.xs);
    await this.handleLockAction(LockAction.create);
  }

  async updateLock({
    lockAmount,
    delegateAddress,
    lockIndex = 0,
    updateAction = LockAction.topUp,
    lockType = LockType.Personal,
  }: IUpdateLockArgs): Promise<void> {
    const shouldExtendPeriod =
      updateAction === LockAction.extend ||
      updateAction === LockAction.topUpAndExtend;

    await this.openCurrentLock(lockIndex, lockType);

    if (shouldExtendPeriod) {
      log.debug("Extending lock period");
      await this.updateLockModalPage.lockPeriodSlider.drag({
        direction: "right",
        pixelsDistance: 3,
      });
    }
    if (delegateAddress?.length) {
      log.debug(`Delegating lock to: ${delegateAddress}`);
      await this.delegate(delegateAddress, { isCreate: false });
    }

    await this.updateLockModalPage.amountInput.enterText(lockAmount);
    await this.updateLockModalPage.enterAmountButton.waitForDisappeared(
      timeouts.xs,
    );
    await this.handleLockAction(updateAction);
  }

  async delegate(
    delegateAddress: string,
    { isCreate }: { isCreate: boolean },
  ): Promise<void> {
    const page = isCreate ? this.page : this.updateLockModalPage;
    await page.delegateCheckbox.click();
    await page.delegateAddressInput.waitForDisplayed(timeouts.xs);
    await page.delegateAddressInput.enterText(delegateAddress);
  }

  async openCurrentLock(lockIndex: number, lockType: LockType): Promise<void> {
    const lock = await this.page.getCurrentLock({
      index: lockIndex,
      type: lockType,
    });
    await lock.updateButton.click();
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

  getAllLocksCount() {
    return this.page.allLockCards.getLength();
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

  async waitForLocks(): Promise<boolean> {
    return waiterHelper.wait(
      async () => {
        const lock = await this.page.getCurrentLockByIndex(0);
        return lock.updateButton.isDisplayed();
      },
      timeouts.xxl,
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
      await this.confirmLockAction(confirmationPopup, action);
    } else {
      log.debug(`Executing '${action}' lock directly - approval not required`);
      await actionButton.click();
      await this.verifyConfirmationPopup("opened", confirmationPopup);
      await this.confirmLockAction(confirmationPopup, action);
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
    action: LockAction,
  ): Promise<void> {
    const expectedActionText = this.getExpectedActionText(action);
    const currentActionText = await this.getActionText({
      expectedActionText,
      actionLabel: confirmationPopup.actionLabel,
      shouldWait: true,
    });
    expect.soft(currentActionText).toBe(expectedActionText);
    await confirmationPopup.todoActionLabel.waitForDisplayed(timeouts.xs);
    await this.metamask.rawModule.confirmTransaction();
    await this.verifyConfirmationPopup("closed", confirmationPopup);
  }

  private async getActionText({
    actionLabel,
    expectedActionText,
    shouldWait = false,
  }: {
    actionLabel: Label;
    expectedActionText: string;
    shouldWait: boolean;
  }): Promise<string> {
    if (shouldWait) {
      await this.waitForActionText(actionLabel, expectedActionText);
    }
    return await actionLabel.getText();
  }

  private async waitForActionText(
    actionLabel: Label,
    expectedActionText: string,
  ): Promise<boolean> {
    let currentActionText = "";
    return waiterHelper.wait(
      async () => {
        currentActionText = await actionLabel.getText({
          timeout: timeouts.l,
          throwError: false,
        });
        return currentActionText === expectedActionText;
      },
      timeouts.m,
      {
        errorMessage: `action label is '${currentActionText}' instead of '${expectedActionText}'`,
        throwError: false,
      },
    );
  }

  private getExpectedActionText(action: LockAction): string {
    return {
      [LockAction.create]: "Lock MENTO",
      [LockAction.topUp]: "Top up lock",
      [LockAction.extend]: "Extend lock",
      [LockAction.topUpAndExtend]: "Top up and extend lock",
    }[action];
  }

  private async approveLock(
    confirmationPopup: IGetConfirmationPopup,
  ): Promise<void> {
    await this.page.approveMentoButton.click();
    await this.verifyConfirmationPopup("opened", confirmationPopup);
    await this.metamask.rawModule.confirmTransaction();
    await waiterHelper.waitForAnimation();
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
      [LockAction.extend]: this.updateLockModalPage.extendLockButton,
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
  topUp = "topUp",
  extend = "extend",
  topUpAndExtend = "topUpAndExtend",
}

interface ICreateLockArgs {
  lockAmount: string;
  delegateAddress?: string;
  shouldExtendPeriod?: boolean;
}

interface IUpdateLockArgs {
  lockAmount: string;
  delegateAddress?: string;
  lockIndex?: number;
  lockType?: LockType;
  updateAction?: LockAction;
}
