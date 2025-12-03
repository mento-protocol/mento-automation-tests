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
import { Address } from "viem";

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
        pixelsDistance: 10,
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

  async waitForLocksSummary(): Promise<boolean> {
    for (const lockSummaryKey of Object.keys(this.page.locksSummary)) {
      await this.page.locksSummary[lockSummaryKey].waitForDisplayed(
        timeouts.xs,
        {
          errorMessage: `${this.page.locksSummary[lockSummaryKey].name} is not displayed!`,
          throwError: false,
        },
      );
    }
    return waiterHelper.wait(
      async () => {
        const locksSummary = await this.getLocksSummary();
        const locksSummaryValues = Object.values(locksSummary);
        return locksSummaryValues.every(value => value >= 0);
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
        return lock.root.isDisplayed();
      },
      timeouts.xxl,
      {
        errorMessage: "No locks displayed!",
      },
    );
  }

  async waitForLocksSummaryToUpdate(
    initialLocksSummaryToCheck: Partial<IGetLocksSummary>,
  ): Promise<boolean> {
    return waiterHelper.wait(
      async () => {
        const locksSummary = await this.getLocksSummary();
        return Object.entries(initialLocksSummaryToCheck).every(
          ([name, value]) => {
            const isUpdated = locksSummary[name] !== value;
            !isUpdated && log.warn(`${name} is not updated ('${value}')`);
            return isUpdated;
          },
        );
      },
      timeouts.xxl,
      {
        errorMessage: "Some lock summary value/s haven't updated!",
        interval: timeouts.xxs,
        throwError: false,
      },
    );
  }

  async waitForDelegateVeMentoToUpdate({
    initialDelegateVeMento,
    delegateAddress,
    tokenToCheck,
  }: {
    initialDelegateVeMento: number;
    delegateAddress: `0x${string}`;
    tokenToCheck: `0x${string}`;
  }): Promise<boolean> {
    return waiterHelper.wait(
      async () => {
        const currentDelegateVeMento = await this.contract.getBalance({
          walletAddress: delegateAddress,
          tokenAddress: tokenToCheck as Address,
        });
        return currentDelegateVeMento !== initialDelegateVeMento;
      },
      timeouts.xl,
      {
        errorMessage: "Delegate veMENTO is not updated!",
        throwError: false,
      },
    );
  }

  async getLocksSummary(): Promise<IGetLocksSummary> {
    const locksSummary: Record<string, number> = {};
    for (const locksSummaryKey of Object.keys(this.page.locksSummary)) {
      const text = await this.page.locksSummary[locksSummaryKey].getText();
      const locksSummaryValueNumber = Number(text.replace(/,/g, ""));
      locksSummary[locksSummaryKey] = locksSummaryValueNumber;
    }
    return {
      totalLockedMento: locksSummary.totalLockedMentoLabel,
      ownLocksVeMento: locksSummary.ownLocksVeMentoLabel,
      delegatedVeMento: locksSummary.delegatedVeMentoLabel,
      receiveVeMento: locksSummary.receivedVeMentoLabel,
      totalVeMento: locksSummary.totalVeMentoLabel,
      withdrawableMento: locksSummary.withdrawableMentoLabel,
    };
  }

  async getReceiveVeMento(): Promise<number> {
    return Number(
      (await this.page.veMentoReceiveLabel.getText()).replace(/ veMENTO/g, ""),
    );
  }

  async isThereWithdrawableMento(): Promise<boolean> {
    const locksSummary = await this.getLocksSummary();
    return locksSummary.withdrawableMento > 0;
  }

  expectLockedMento({
    isThereWithdrawableMento,
    currentTotalLockedMento,
    initialTotalLockedMento,
    currentWithdrawableMento,
    initialWithdrawableMento,
    lockAmount,
  }: IExpectLockedMentoArgs): void {
    // If there's withdrawable MENTO it uses that to update lock and and withdrawable MENTO should decrease.
    // Otherwise, it uses new MENTO and locked MENTO should increase.
    if (isThereWithdrawableMento) {
      log.debug(
        "Uses withdrawable MENTO to update lock - no new MENTO is used",
      );
      expect.soft(currentTotalLockedMento).toBe(initialTotalLockedMento);
      expect
        .soft(currentWithdrawableMento)
        .toBe(initialWithdrawableMento - lockAmount);
    } else {
      log.debug(
        "Uses new MENTO to update lock - withdrawable MENTO is not used",
      );
      expect
        .soft(currentTotalLockedMento)
        .toBeGreaterThan(initialTotalLockedMento);
      expect
        .soft(currentWithdrawableMento)
        .toBeGreaterThanOrEqual(initialWithdrawableMento);
    }
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
    await confirmationPopup.todoActionLabel.waitForDisplayed(timeouts.m, {
      errorMessage: `${confirmationPopup.todoActionLabel.name} is not displayed!`,
      throwError: false,
    });
    await this.metamask.confirmTransaction();
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
    return waiterHelper.wait(
      async () => {
        const currentActionText = await actionLabel.getText({
          timeout: timeouts.l,
          throwError: false,
        });
        return currentActionText === expectedActionText;
      },
      timeouts.m,
      {
        errorMessage: `action label is not '${expectedActionText}'`,
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
  lockAmount: number | string;
  delegateAddress?: string;
  lockIndex?: number;
  lockType?: LockType;
  updateAction?: LockAction;
}

interface IGetLocksSummary {
  totalLockedMento: number;
  ownLocksVeMento: number;
  delegatedVeMento: number;
  receiveVeMento: number;
  totalVeMento: number;
  withdrawableMento: number;
}

interface IExpectLockedMentoArgs {
  isThereWithdrawableMento: boolean;
  currentTotalLockedMento: number;
  initialTotalLockedMento: number;
  currentWithdrawableMento: number;
  initialWithdrawableMento: number;
  lockAmount: number;
}
