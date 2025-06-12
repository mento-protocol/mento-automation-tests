import { ConfirmSwapPo } from "@page-objects/index";
import { waiterHelper } from "@helpers/waiter/waiter.helper";
import { timeouts } from "@constants/timeouts.constants";
import { ClassLog } from "@decorators/logger.decorators";
import { IConfirmSwapServiceArgs, BaseService } from "@services/index";
import { loggerHelper } from "@helpers/logger/logger.helper";
import { testUtils } from "@helpers/suite/suite.helper";

const logger = loggerHelper.get("ConfirmSwapService");

@ClassLog
export class ConfirmSwapService extends BaseService {
  public override page: ConfirmSwapPo = null;

  constructor(args: IConfirmSwapServiceArgs) {
    const { page } = args;
    super(args);
    this.page = page;
  }

  async getRate(): Promise<string> {
    return (await this.page.rateLabel.getText()).replace("=", "~");
  }

  async confirmBothTxs(): Promise<void> {
    await this.confirmApprovalTx();
    await this.confirmSwapTx();
  }

  async confirmApprovalTx(): Promise<void> {
    await this.metamaskHelper.confirmTransaction();
    await this.page.approveCompleteNotificationLabel.waitUntilDisplayed(
      timeouts.xl,
      { errorMessage: "Approve tx notification is not displayed" },
    );
  }

  async confirmSwapTx(): Promise<void> {
    await this.page.swapButton.click({ timeout: timeouts.s });
    await this.verifyNoValidMedianCase();
    await this.verifyTradingSuspendedCase();
    await this.metamaskHelper.confirmTransaction();
    await this.page.swapCompleteNotificationLabel.waitUntilDisplayed(
      timeouts.xl,
      { errorMessage: "Swap tx notification is not displayed" },
    );
  }

  async verifyNoValidMedianCase(): Promise<void> {
    return (await this.isNoValidMedian())
      ? testUtils.disableInRuntime(
          { reason: "No valid median to swap" },
          "'no valid median' case",
        )
      : logger.info("'No valid median' case is not defined - keep swapping");
  }

  async verifyTradingSuspendedCase(): Promise<void> {
    if (await this.isTradingSuspended()) {
      logger.error("Trading is suspended for this reference rate");
      throw new Error("Trading is suspended for this reference rate");
    }
    logger.info("'Trading suspended' case is not defined - keep swapping");
  }

  async rejectByType(txType: "approval" | "swap"): Promise<void> {
    const isApprovalTx = txType === "approval";
    logger.warn(
      `Rejection of ${isApprovalTx ? "approval and swap txs" : "swap tx"}`,
    );
    isApprovalTx ? await this.rejectApprovalTx() : await this.rejectSwapTx();
    // await this.page.swapPerformingPopupLabel.waitUntilDisappeared(timeouts.s, {
    //   errorMessage: "Swap performing popup is still there",
    // });
  }

  private async rejectApprovalTx(): Promise<void> {
    if (
      await this.page.approveButton.waitUntilDisplayed(timeouts.s, {
        throwError: false,
      })
    ) {
      await this.metamaskHelper.rejectTransaction();
    } else {
      throw new Error("No approval tx defined");
    }
  }

  private async rejectSwapTx(): Promise<void> {
    if (
      await this.page.approveButton.waitUntilDisplayed(timeouts.s, {
        throwError: false,
      })
    ) {
      await this.metamaskHelper.confirmTransaction();
      await this.page.approveCompleteNotificationLabel.waitUntilDisplayed(
        timeouts.xl,
        { errorMessage: "Approve tx notification is not displayed" },
      );
      await this.metamaskHelper.rejectTransaction();
    } else {
      await this.metamaskHelper.rejectTransaction();
    }
  }

  async navigateToCeloExplorer(): Promise<void> {
    await this.page.seeDetailsLinkButton.click();
  }

  async isApproveCompleteNotificationThere(): Promise<boolean> {
    return this.page.approveCompleteNotificationLabel.waitUntilDisplayed(
      timeouts.xl,
      { throwError: false },
    );
  }

  async isRejectApprovalTxNotificationThere(): Promise<boolean> {
    return this.page.rejectApprovalTransactionNotificationLabel.waitUntilDisplayed(
      timeouts.s,
      { throwError: false },
    );
  }

  async isRejectSwapTxNotificationThere(): Promise<boolean> {
    return this.page.rejectSwapTransactionNotificationLabel.waitUntilDisplayed(
      timeouts.s,
      { throwError: false },
    );
  }

  private async isNoValidMedian(): Promise<boolean> {
    return !(await this.isRateLoaded())
      ? waiterHelper.retry(
          async () => {
            return this.browser.hasConsoleErrorsMatchingText("no valid median");
          },
          5,
          {
            interval: timeouts.xs,
            throwError: false,
            continueWithException: true,
            errorMessage: "Checking for a 'no valid median' case",
          },
        )
      : false;
  }

  private async isTradingSuspended(): Promise<boolean> {
    return waiterHelper.retry(
      async () => {
        return this.browser.hasConsoleErrorsMatchingText(
          "Trading is suspended for this reference rate",
        );
      },
      2,
      {
        interval: timeouts.xs,
        throwError: false,
        continueWithException: true,
        errorMessage: "Checking for a 'trading suspended' case",
      },
    );
  }
}
