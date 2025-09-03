import { waiterHelper } from "@helpers/waiter/waiter.helper";
import { timeouts } from "@constants/timeouts.constants";
import { ClassLog } from "@decorators/logger.decorators";
import { loggerHelper } from "@helpers/logger/logger.helper";
import { testUtils } from "@helpers/suite/suite.helper";
import { ConfirmSwapPage } from "./confirm-swap.page";
import { BaseService, IBaseServiceArgs } from "@shared/web/base/base.service";
import { AmountType } from "../swap/swap.service.types";
import { expect } from "@fixtures/test.fixture";

const log = loggerHelper.get("ConfirmSwapService");

@ClassLog
export class ConfirmSwapService extends BaseService {
  public override page: ConfirmSwapPage = null;

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
    await this.page.approveButton.click({ timeout: timeouts.s });
    await this.metamask.confirmTransaction();
    await this.expectSuccessApprovalNotification();
  }

  async confirmSwapTx({
    shouldExpectLoading = false,
  }: { shouldExpectLoading?: boolean } = {}): Promise<void> {
    await this.page.swapButton.click({ timeout: timeouts.s });
    await this.verifyTradingSuspendedCase();
    await this.metamask.confirmTransaction();
    if (shouldExpectLoading) await this.expectLoadingDuringTxConfirmation();
    await this.expectSuccessSwapNotification();
  }

  async verifyNoValidMedianCase(): Promise<void> {
    return (await this.isNoValidMedian())
      ? testUtils.disableInRuntime(
          { reason: "No valid median to swap" },
          "'no valid median' case",
        )
      : log.info("'No valid median' case is not defined - keep swapping");
  }

  async verifyTradingSuspendedCase(): Promise<void> {
    if (await this.isTradingSuspended()) {
      log.error("Trading is suspended for this reference rate");
      throw new Error("Trading is suspended for this reference rate");
    }
    log.info("'Trading suspended' case is not defined - keep swapping");
  }

  async rejectByType(txType: "approval" | "swap"): Promise<void> {
    const isApprovalTx = txType === "approval";
    log.warn(
      `Rejection of ${isApprovalTx ? "approval and swap txs" : "swap tx"}`,
    );
    isApprovalTx ? await this.rejectApprovalTx() : await this.rejectSwapTx();
  }

  async getAmountByType(amountType: AmountType): Promise<string> {
    const amountInput =
      amountType === AmountType.Sell
        ? this.page.sellAmountLabel
        : this.page.buyAmountLabel;
    return amountInput.getText();
  }

  async getUsdAmountByType(amountType: AmountType): Promise<string> {
    const amountInput =
      amountType === AmountType.Sell
        ? this.page.sellUsdAmountLabel
        : this.page.buyUsdAmountLabel;
    return (await amountInput.getText()).replaceAll("~$", "");
  }

  private async rejectApprovalTx(): Promise<void> {
    if (
      await this.page.approveButton.waitUntilDisplayed(timeouts.s, {
        throwError: false,
      })
    ) {
      await this.metamask.rejectTransaction();
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
      await this.metamask.confirmTransaction();
      await this.page.approveCompleteNotificationLabel.waitUntilDisplayed(
        timeouts.xl,
        { errorMessage: "Approve tx notification is not displayed" },
      );
      await this.metamask.rejectTransaction();
    } else {
      await this.metamask.rejectTransaction();
    }
  }

  async navigateToCeloExplorer(): Promise<void> {
    await this.page.seeDetailsLinkButton.click();
  }

  async expectSuccessApprovalNotification(): Promise<void> {
    expect
      .soft(
        await this.page.approveCompleteNotificationLabel.waitUntilDisplayed(
          timeouts.xl,
          {
            errorMessage: "Approve tx notification is not displayed",
            throwError: false,
          },
        ),
      )
      .toBeTruthy();
  }

  async expectSuccessSwapNotification(): Promise<void> {
    expect
      .soft(
        await this.page.swapCompleteNotificationLabel.waitUntilDisplayed(
          timeouts.m,
          {
            errorMessage: "Swap tx notification is not displayed",
            throwError: false,
          },
        ),
      )
      .toBeTruthy();
  }

  async expectLoadingDuringTxConfirmation(): Promise<void> {
    const isLoadingDuringConfirmation = await waiterHelper.checkDuring({
      checkCallback: async () => await this.page.loadingLabel.isDisplayed(),
      duringCallback: async () => {
        await waiterHelper.waitForAnimation();
        return await this.page.isOpen({
          timeout: timeouts.xxxs,
          shouldLog: false,
        });
      },
      duringTimeout: timeouts.m,
      throwError: false,
      errorMessage:
        "Loading label is not displayed while 'Confirm Swap' page is still open",
    });
    expect.soft(isLoadingDuringConfirmation).toBeTruthy();
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

export interface IConfirmSwapServiceArgs extends IBaseServiceArgs {
  page: ConfirmSwapPage;
}

export interface IExpectChangedBalanceArgs {
  initialBalance: number;
  currentBalance: number;
}
