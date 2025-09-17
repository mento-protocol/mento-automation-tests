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
  }: Pick<IUpdateLockArgs, "lockAmount">): Promise<void> {
    await waiterHelper.waitForAnimation();
    await this.page.lockAmountInput.enterText(lockAmount);
    await this.page.enterAmountButton.waitForDisappeared(timeouts.xs);
    await this.handleLockAction(LockAction.create);
  }

  async updateLock({ lockAmount, lockIndex }: IUpdateLockArgs): Promise<void> {
    await this.openExistingLockByIndex(lockIndex);
    await this.updateLockModalPage.amountInput.enterText(lockAmount);
    await this.updateLockModalPage.enterAmountButton.waitForDisappeared(
      timeouts.xs,
    );
    await this.handleLockAction(LockAction.update);
  }

  async openExistingLockByIndex(lockIndex: number): Promise<void> {
    await this.page.getExistingLockByIndex(lockIndex).click();
    await this.updateLockModalPage.verifyIsOpen();
  }

  async verifyConfirmationPopup(
    toVerify: "opened" | "closed",
    confirmationPopup: ReturnType<
      typeof VotingPowerPage.prototype.getConfirmationPopup
    >,
  ) {
    await confirmationPopup.headerLabel.waitForDisplayed(timeouts.s, {
      errorMessage: `'${await confirmationPopup.headerLabel.getText()}' confirmation popup is not ${toVerify}!`,
    });
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
    const isCreate = action === LockAction.create;
    const { actionButton, successNotificationLabel, confirmationPopup } =
      this.getKeyElementsByAction(isCreate);
    const shouldApprove = await this.shouldApprove(isCreate);

    if (shouldApprove) {
      log.debug(`Approving mento first to be able to '${action}' lock`);
      await this.approveLock(confirmationPopup);
      await this.verifyConfirmationPopup("opened", confirmationPopup);
      log.debug(`Executing '${action}' lock after approving mento`);
      await this.confirmLockAction(confirmationPopup, isCreate);
    } else {
      log.debug(`Executing '${action}' lock directly - approval not required`);
      await actionButton.click();
      await this.verifyConfirmationPopup("opened", confirmationPopup);
      await this.confirmLockAction(confirmationPopup, isCreate);
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

  private async shouldApprove(isCreate: boolean): Promise<boolean> {
    const { page } = this.getKeyElementsByAction(isCreate);
    return await page.approveMentoButton.waitForDisplayed(timeouts.xs, {
      errorMessage: `${page.approveMentoButton.name} is not there!`,
      throwError: false,
    });
  }

  private async confirmLockAction(
    confirmationPopup: IGetConfirmationPopup,
    isCreate?: boolean,
  ): Promise<void> {
    // TODO: Temporal check until update lock confirmation popup doesn't have the action label text
    isCreate &&
      (await confirmationPopup.actionLabel.waitForDisplayed(timeouts.s));
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

  private getKeyElementsByAction(isCreate: boolean) {
    return {
      page: isCreate ? this.page : this.updateLockModalPage,
      actionButton: isCreate
        ? this.page.lockMentoButton
        : this.updateLockModalPage.topUpLockButton,
      successNotificationLabel: isCreate
        ? this.page.createLockSuccessfullyNotificationLabel
        : this.page.updateLockSuccessfullyNotificationLabel,
      confirmationPopup: this.page.getConfirmationPopup(isCreate),
    };
  }
}

interface IVotingPowerServiceArgs extends IBaseServiceArgs {
  page: VotingPowerPage;
  updateLockModalPage: UpdateLockModalPage;
}

export enum LockAction {
  create = "create",
  update = "update",
}

interface IUpdateLockArgs {
  lockAmount: string;
  lockIndex: number;
}
