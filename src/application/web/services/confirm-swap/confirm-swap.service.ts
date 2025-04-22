import { ConfirmSwapPo } from "@page-objects/index";
import { waiterHelper } from "@helpers/waiter/waiter.helper";
import { timeouts } from "@constants/timeouts.constants";
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

  async confirm(): Promise<void> {
    if (
      await this.page.approveAndSwapTxsLabel.waitUntilDisplayed(timeouts.s, {
        throwError: false,
      })
    ) {
      logger.debug(
        "Sent and confirms approval and swap txs because sufficient allowance is not exist yet",
      );
      await this.confirmApprovalAndSwapTransactions();
    } else {
      logger.debug(
        "Sent and confirms only swap tx because sufficient allowance already exists",
      );
      await this.metamaskHelper.confirmTransaction();
    }
    await this.page.swapCompleteNotificationLabel.waitUntilDisplayed(
      timeouts.xl,
      { errorMessage: "Swap completion notification is not displayed" },
    );
    await this.page.swapPerformingPopupLabel.waitUntilDisappeared(timeouts.s, {
      errorMessage: "Swap performing popup is still there",
    });
  }

  private async confirmApprovalAndSwapTransactions(): Promise<void> {
    await this.metamaskHelper.confirmTransaction();
    await this.page.approveCompleteNotificationLabel.waitUntilDisplayed(
      timeouts.xl,
      { errorMessage: "Approve tx notification is not displayed" },
    );
    await this.metamaskHelper.confirmTransaction();
  }

  async rejectByType(txType: "approval" | "swap"): Promise<void> {
    const isApprovalTx = txType === "approval";
    logger.warn(
      `Rejection of ${isApprovalTx ? "approval and swap txs" : "swap tx"}`,
    );
    isApprovalTx ? await this.rejectApprovalTx() : await this.rejectSwapTx();
    await this.page.swapPerformingPopupLabel.waitUntilDisappeared(timeouts.s, {
      errorMessage: "Swap performing popup is still there",
    });
  }

  private async rejectApprovalTx(): Promise<void> {
    if (
      await this.page.approveAndSwapTxsLabel.waitUntilDisplayed(timeouts.s, {
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
      await this.page.approveAndSwapTxsLabel.waitUntilDisplayed(timeouts.s, {
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
}
