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
import { loggerHelper } from "@helpers/logger/logger.helper";

const logger = loggerHelper.get("ConfirmSwapService");

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

  async finish(): Promise<void> {
    if (
      await this.page.approveAndSwapTxsLabel.waitUntilDisplayed(timeouts.xs, {
        throwError: false,
      })
    ) {
      logger.debug(
        "Sent and confirms approval and swap txs because sufficient allowance is not exist yet",
      );
      await this.metamaskHelper.confirmTransaction();
      await waiterHelper.sleep(timeouts.xs, {
        sleepReason: "Waiting for a second tx",
      });
      await this.metamaskHelper.confirmTransaction();
    } else {
      logger.debug(
        "Sent and confirms only swap tx because sufficient allowance already exists",
      );
      await this.metamaskHelper.confirmTransaction();
    }
  }

  async expectSuccessfulNotifications(): Promise<void> {
    expect.soft(await this.isSwapPerformingPopupThere()).toBeTruthy();
    if (await this.page.approveAndSwapTxsLabel.isDisplayed()) {
      logger.debug("Checks for approval and swap completion notifications");
      expect.soft(await this.isApproveCompleteNotificationThere()).toBeTruthy();
      expect.soft(await this.isSwapCompleteNotificationThere()).toBeTruthy();
    } else {
      logger.debug("Checks for swap completion notification only");
      expect.soft(await this.isSwapCompleteNotificationThere()).toBeTruthy();
    }
    await this.page.swapPerformingPopupLabel.waitUntilDisappeared(timeouts.s, {
      throwError: false,
    });
  }

  async navigateToCeloExplorer(): Promise<void> {
    await this.page.seeDetailsLinkButton.click();
  }

  async isSwapPerformingPopupThere(): Promise<boolean> {
    return this.page.swapPerformingPopupLabel.waitUntilDisplayed(timeouts.m, {
      throwError: false,
    });
  }

  async isApproveCompleteNotificationThere(): Promise<boolean> {
    return this.page.approveCompleteNotificationLabel.waitUntilDisplayed(
      timeouts.xl,
      { throwError: false },
    );
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
    return this.page.rejectApprovalTransactionNotificationLabel.waitUntilDisplayed(
      timeouts.s,
      { throwError: false },
    );
  }

  async isRejectSwapTransactionNotificationThere(): Promise<boolean> {
    return this.page.rejectSwapTransactionNotificationLabel.waitUntilDisplayed(
      timeouts.s,
      { throwError: false },
    );
  }
}
