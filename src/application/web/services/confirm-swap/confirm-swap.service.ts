import { ConfirmSwapPo } from "@page-objects/index";
import { waiterHelper } from "@helpers/waiter/waiter.helper";
import { timeouts } from "@constants/timeouts.constants";
import { expect } from "@fixtures/common/common.fixture";
import { ClassLog } from "@decorators/logger.decorators";
import {
  IConfirmSwapService,
  IConfirmSwapServiceArgs,
  BaseService,
} from "@services/index";
import { IWallet } from "@fixtures/common/common.fixture.types";
import { loggerHelper } from "@helpers/logger/logger.helper";

const logger = loggerHelper.get("Confirm-Swap-Service");

@ClassLog
export class ConfirmSwapService
  extends BaseService
  implements IConfirmSwapService
{
  public override page: ConfirmSwapPo = null;

  constructor(args: IConfirmSwapServiceArgs) {
    const { page } = args;
    super(args);
    this.page = page;
  }

  async getCurrentPriceFromConfirmation(): Promise<string> {
    return (await this.page.currentPriceLabel.getText()).replace(":", "~");
  }

  async getCurrentPriceFromSwap(waitTimeout?: number): Promise<string> {
    waitTimeout &&
      (await waiterHelper.sleep(waitTimeout, {
        sleepReason: "re-calculating after swapping inputs",
      }));
    return this.page.currentPriceLabel.getText();
  }

  async finish(wallet: IWallet): Promise<void> {
    if (!(await this.page.approveAndSwapTxsLabel.isDisplayed())) {
      logger.debug(
        "Sent and confirms only swap tx because sufficient allowance already exists",
      );
      await wallet.helper.confirmTransaction();
    } else {
      logger.debug(
        "Sent and confirms approval and swap txs because sufficient allowance is not exist yet",
      );
      await wallet.helper.confirmTransaction();
      await wallet.helper.confirmTransaction();
    }
  }

  async expectSuccessfulNotifications(): Promise<void> {
    expect.soft(await this.isSwapPerformingPopupThere()).toBeTruthy();
    expect.soft(await this.isSwapCompleteNotificationThere()).toBeTruthy();
  }

  async navigateToCeloExplorer(): Promise<void> {
    await this.page.seeDetailsLinkButton.click();
  }

  async isSwapPerformingPopupThere(): Promise<boolean> {
    return this.page.swapPerformingPopupLabel.isDisplayed();
  }

  async isApproveCompleteNotificationThere(): Promise<boolean> {
    return this.page.approveCompleteNotificationLabel.isDisplayed();
  }

  async isSwapCompleteNotificationThere(): Promise<boolean> {
    return this.page.swapCompleteNotificationLabel.waitUntilDisplayed(
      timeouts.xl,
      {
        throwError: false,
      },
    );
  }

  async isRejectApprovalTransactionNotificationThere(): Promise<boolean> {
    return this.page.rejectApprovalTransactionNotificationLabel.isDisplayed();
  }

  async isRejectSwapTransactionNotificationThere(): Promise<boolean> {
    return this.page.rejectSwapTransactionNotificationLabel.isDisplayed();
  }
}
