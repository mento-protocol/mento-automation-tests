import { BaseService, IBaseServiceArgs } from "@shared/web/base/base.service";
import { ClassLog } from "@decorators/logger.decorators";
import { VotingPowerPage } from "./voting-power.page";
import { waiterHelper } from "@helpers/waiter/waiter.helper";
import { timeouts } from "@constants/index";
import { expect } from "@fixtures/test.fixture";

@ClassLog
export class VotingPowerService extends BaseService {
  public override page: VotingPowerPage = null;

  constructor(args: IVotingPowerServiceArgs) {
    const { page } = args;
    super(args);
    this.page = page;
  }

  async topUpLock(amount: string): Promise<void> {
    await waiterHelper.waitForAnimation();
    await this.enterAmount(amount);
    // expect.soft(await this.getReceiveVeMento()).toBeGreaterThan(0);
    await this.handleTopUp();
  }

  async handleTopUp() {
    await this.page.enterAmountButton.waitUntilDisappeared(timeouts.xs);
    if (await this.waitForActionButton("approveMentoButton")) {
      await this.page.approveMentoButton.click();
      await this.verifyConfirmationPopupIsOpened();
      await this.metamask.confirmTransaction();
      await this.verifyConfirmationPopupIsClosed();
    }
    if (await this.waitForActionButton("topUpLockButton")) {
      await this.page.topUpLockButton.click();
      await this.verifyConfirmationPopupIsOpened();
      await this.metamask.confirmTransaction();
      await this.verifyConfirmationPopupIsClosed();
    }
    expect
      .soft(
        await this.page.lockUpdatedSuccessfullyNotificationLabel.waitUntilDisplayed(
          timeouts.s,
          {
            errorMessage: "Top-up success notification is not displayed!",
            throwError: false,
          },
        ),
      )
      .toBeTruthy();
  }

  async waitForActionButton(
    buttonName: "approveMentoButton" | "topUpLockButton",
  ): Promise<boolean> {
    return this.page[buttonName].waitUntilDisplayed(timeouts.xs, {
      errorMessage: `${buttonName} is not there!`,
      throwError: false,
    });
  }

  async verifyConfirmationPopupIsClosed() {
    await this.page.topUpLockPopupDescriptionLabel.waitUntilDisappeared(
      timeouts.s,
      {
        errorMessage: "Lock confirmation popup is not closed!",
      },
    );
  }

  async verifyConfirmationPopupIsOpened() {
    await this.page.topUpLockPopupDescriptionLabel.waitUntilDisplayed(
      timeouts.s,
      {
        errorMessage: "Lock confirmation popup is not displayed!",
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
      { errorMessage: "Lock values are not changed!", interval: timeouts.xs },
    );
  }

  async enterAmount(amount: string): Promise<void> {
    await this.page.lockAmountInput.enterText(amount);
  }

  async getCurrentLockValues(): Promise<{ veMento: number; mento: number }> {
    const veMentoValueText =
      await this.page.existingLock.veMentoLabel.getText();
    const mentoValueText = await this.page.existingLock.mentoLabel.getText();
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
}

interface IVotingPowerServiceArgs extends IBaseServiceArgs {
  page: VotingPowerPage;
}
