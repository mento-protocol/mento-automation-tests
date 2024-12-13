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
    await wallet.helper.confirmTransaction();
  }

  async expectSuccessfulTransaction(): Promise<void> {
    expect
      .soft(
        await this.isSwapPerformingPopupThere(),
        "missing swap performing popup",
      )
      .toBeTruthy();
    expect
      .soft(
        await this.isApproveCompleteNotificationThere(),
        "missing approve complete notification",
      )
      .toBeTruthy();
    expect
      .soft(
        await this.isSwapCompleteNotificationThere(),
        "missing swap complete notification",
      )
      .toBeTruthy();
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
      timeouts.l,
      { throwError: false },
    );
  }

  async isRejectApprovalTransactionNotificationThere(): Promise<boolean> {
    return this.page.rejectApprovalTransactionNotificationLabel.isDisplayed();
  }

  async isRejectSwapTransactionNotificationThere(): Promise<boolean> {
    return this.page.rejectSwapTransactionNotificationLabel.isDisplayed();
  }
}
