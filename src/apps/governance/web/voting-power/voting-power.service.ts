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
    await this.handleAction("create");
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
    await this.handleAction("top-up");
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

  async verifyConfirmationPopupIsClosed() {
    await this.page.topUpLockPopupDescriptionLabel.waitForDisappeared(
      timeouts.s,
      {
        errorMessage: "Lock confirmation popup is not closed!",
      },
    );
  }

  async verifyConfirmationPopupIsOpened() {
    await this.page.topUpLockPopupDescriptionLabel.waitForDisplayed(
      timeouts.s,
      {
        errorMessage: "Lock confirmation popup is not displayed!",
      },
    );
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

  private async handleAction(action: "top-up" | "create") {
    const page = action === "top-up" ? this.updateLockModalPage : this.page;
    const actionButton =
      action === "top-up"
        ? this.updateLockModalPage.topUpLockButton
        : this.page.lockMentoButton;
    const successNotificationLabel =
      action === "top-up"
        ? this.page.updateLockSuccessfullyNotificationLabel
        : this.page.createLockSuccessfullyNotificationLabel;

    if (await this.waitForActionButton(page.approveMentoButton)) {
      log.debug(`Approving mento first to be able to ${action} lock`);
      await page.approveMentoButton.click();
      await this.verifyConfirmationPopupIsOpened();
      await this.metamask.rawModule.confirmTransaction();
      await this.metamask.rawModule.approveTokenPermission();
      await this.verifyConfirmationPopupIsClosed();
    }

    if (await this.waitForActionButton(actionButton, { throwError: true })) {
      log.debug(`${action} lock directly`);
      await actionButton.click();
      await this.verifyConfirmationPopupIsOpened();
      await this.metamask.confirmTransaction();
      await this.verifyConfirmationPopupIsClosed();
    }

    expect
      .soft(
        await successNotificationLabel.waitForDisplayed(timeouts.s, {
          errorMessage: `${action} success notification is not displayed!`,
          throwError: false,
        }),
      )
      .toBeTruthy();
  }
}

interface IVotingPowerServiceArgs extends IBaseServiceArgs {
  page: VotingPowerPage;
  updateLockModalPage: UpdateLockModalPage;
}
