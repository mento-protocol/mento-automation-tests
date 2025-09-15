import { BaseService, IBaseServiceArgs } from "@shared/web/base/base.service";
import { ClassLog } from "@decorators/logger.decorators";
import { VotingPowerPage } from "./voting-power.page";
import { waiterHelper } from "@helpers/waiter/waiter.helper";
import { timeouts } from "@constants/index";
import { expect } from "@fixtures/test.fixture";
import { loggerHelper } from "@helpers/logger/logger.helper";
import { UpdateLockModalPage } from "./update-lock-modal.page";
import { Button } from "@shared/web/elements";

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

  async createLock({ lockAmount }: { lockAmount: string }): Promise<void> {
    await waiterHelper.waitForAnimation();
    await this.enterAmount(lockAmount);
    await this.handleLockAction(LockAction.create);
  }

  async topUpLock({
    lockAmount,
    lockIndex,
  }: {
    lockAmount: string;
    lockIndex: number;
  }): Promise<void> {
    await this.openExistingLockByIndex(lockIndex);
    await this.updateLockModalPage.amountInput.enterText(lockAmount);
    await this.handleLockAction(LockAction.update);
  }

  async openExistingLockByIndex(lockIndex: number): Promise<void> {
    await this.page.getExistingLockByIndex(lockIndex).click();
    await this.updateLockModalPage.verifyIsOpen();
  }

  async waitForActionButton(
    button: Button,
    { throwError = false }: { throwError?: boolean } = {},
  ): Promise<boolean> {
    return button.waitForDisplayed(timeouts.xs, {
      errorMessage: `${button.name} is not there!`,
      throwError,
    });
  }

  async verifyConfirmationPopup(
    toVerify: "opened" | "closed",
    confirmationPopup: ReturnType<
      typeof VotingPowerPage.prototype.getConfirmationPopup
    >,
  ) {
    await confirmationPopup.headerLabel.waitForDisplayed(timeouts.s, {
      errorMessage: `'${confirmationPopup.headerLabel.getText()}' confirmation popup is not ${toVerify}!`,
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

  async enterAmount(amount: string): Promise<void> {
    await this.page.lockAmountInput.enterText(amount);
    await this.page.enterAmountButton.waitForDisappeared(timeouts.xs);
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
    const { page, actionButton, successNotificationLabel, confirmationPopup } =
      this.getKeyElementsByAction(action);
    const shouldApprove = await this.waitForActionButton(
      page.approveMentoButton,
    );

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

  private async confirmLockAction(
    confirmationPopup: ReturnType<
      typeof VotingPowerPage.prototype.getConfirmationPopup
    >,
  ): Promise<void> {
    await confirmationPopup.actionLabel.waitForDisplayed(timeouts.xs);
    await confirmationPopup.todoActionLabel.waitForDisplayed(timeouts.xs);
    await this.metamask.confirmTransaction();
    await this.verifyConfirmationPopup("closed", confirmationPopup);
  }

  private async approveLock(
    confirmationPopup: ReturnType<
      typeof VotingPowerPage.prototype.getConfirmationPopup
    >,
  ): Promise<void> {
    await this.page.approveMentoButton.click();
    await this.verifyConfirmationPopup("opened", confirmationPopup);
    await this.metamask.rawModule.confirmTransaction();
    await waiterHelper.waitForAnimation();
    await this.metamask.rawModule.confirmTransaction();
  }

  private getKeyElementsByAction(action: LockAction) {
    return {
      page: action === LockAction.update ? this.updateLockModalPage : this.page,
      actionButton:
        action === LockAction.update
          ? this.updateLockModalPage.topUpLockButton
          : this.page.lockMentoButton,
      successNotificationLabel:
        action === LockAction.update
          ? this.page.updateLockSuccessfullyNotificationLabel
          : this.page.createLockSuccessfullyNotificationLabel,
      confirmationPopup: this.page.getConfirmationPopup(action),
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
