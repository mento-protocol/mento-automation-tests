import { BrowserContext } from "@playwright/test";

import { BaseService } from "./base.service";
import { SwapPo } from "../pageObjects/swap.po";
import { ConfirmSwapPo } from "@web/pageObjects/confirm-swap.po";
import { waiterHelper } from "@helpers/waiter/waiter.helper";
import { timeouts } from "@constants/timeouts.constants";
import { CeloExplorerPo } from "@web/pageObjects/celo-explorer.po";
import { expect } from "@fixtures/common.fixture";
import { loggerHelper } from "@helpers/logger/logger.helper";
import { Input } from "@web/pageElements/input";
import { ISwapServiceArgs } from "@web/services/types/swap.service.types";
import {
  IFillFromOptions,
  ISelectTokensArgs,
  Slippage,
} from "@web/services/types/get-web-services.types";
import { ClassLog } from "@decorators/logger.decorators";

const logger = loggerHelper.get("SwapService");

export interface ISwapService {
  selectTokens: (args: ISelectTokensArgs) => Promise<void>;
  enterFromAmount: (
    amount: string,
    shouldWaitForLongAnimation?: boolean,
  ) => Promise<void>;
  enterToAmount: (
    amount: string,
    shouldWaitForLongAnimation?: boolean,
  ) => Promise<void>;
  chooseSlippage: (slippage: Slippage) => Promise<void>;
  fillForm: (args: IFillFromOptions) => Promise<void>;
  start: () => Promise<void>;
  continueToConfirmation: () => Promise<void>;
}

@ClassLog
export class SwapService extends BaseService implements ISwapService {
  protected swapPage: SwapPo = null;
  protected confirmSwapPage: ConfirmSwapPo = null;
  protected celoExplorerPage: CeloExplorerPo = null;

  constructor(args: ISwapServiceArgs) {
    const { swapPage, confirmSwapPage, celoExplorerPage } = args;
    super(args);
    this.swapPage = swapPage;
    this.confirmSwapPage = confirmSwapPage;
    this.celoExplorerPage = celoExplorerPage;
  }

  async selectTokens(args: ISelectTokensArgs): Promise<void> {
    logger.debug(`Selecting tokens...`);
    args?.from &&
      (await this.swapPage.fromDropdown.selectOptionByName(args?.from));
    args?.to && (await this.swapPage.toDropdown.selectOptionByName(args?.to));
  }

  async enterFromAmount(
    amount: string,
    shouldWaitForLongAnimation: boolean = true,
  ): Promise<void> {
    logger.debug(`Entering '${amount}' amount...`);
    await this.enterAmount(
      amount,
      this.swapPage.fromAmountInput,
      shouldWaitForLongAnimation,
    );
  }

  async enterToAmount(
    amount: string,
    shouldWaitForLongAnimation: boolean = true,
  ): Promise<void> {
    logger.debug(`Entering '${amount}' amount...`);
    await this.enterAmount(
      amount,
      this.swapPage.toAmountInput,
      shouldWaitForLongAnimation,
    );
  }

  private async enterAmount(
    amount: string,
    input: Input,
    shouldWaitForLongAnimation: boolean,
  ): Promise<void> {
    logger.debug(`Entering '${amount}' amount...`);
    await input.enterText(amount);
    shouldWaitForLongAnimation &&
      (await waiterHelper.sleep(timeouts.xs, {
        sleepReason:
          "flaky incorrect continueButton state after fast pressing after entering amount",
      }));
  }

  async chooseSlippage(slippage: Slippage): Promise<void> {
    logger.debug(`Choosing the '${slippage}' slippage.`);
    await this.showSlippage();
    await this.swapPage.maxSlippageButtons[slippage].jsClick();
  }

  async fillForm(args: IFillFromOptions): Promise<void> {
    logger.debug("Filling swap fields...");
    const { slippage, fromAmount, toAmount, tokens } = args;
    slippage && (await this.chooseSlippage(slippage));
    await this.selectTokens(tokens);
    fromAmount?.length && (await this.enterFromAmount(fromAmount));
    toAmount?.length && (await this.enterToAmount(toAmount, false));
  }

  async start(): Promise<void> {
    logger.debug("Starting swapping...");
    await this.swapPage.continueButton.click();
    await this.swapPage.continueButton.waitUntilDisappeared(timeouts.xxxs);
    await waiterHelper.retry(
      async () => {
        await this.confirmSwapPage.swapButton.click();
        return this.confirmSwapPage.swapPerformingPopupLabel.waitUntilDisplayed(
          timeouts.xxs,
        );
      },
      3,
      { resolveWhenNoException: true, errorMessage: "couldn't start to swap" },
    );
  }

  async continueToConfirmation(): Promise<void> {
    logger.debug(`Navigating to confirmation stage...`);
    await this.swapPage.continueButton.click();
  }

  async swapInputs(): Promise<{
    beforeSwapPrice: string;
    afterSwapPrice: string;
  }> {
    logger.debug(`Swapping inputs...`);
    const beforeSwapPrice = await this.getCurrentPriceFromSwap();
    await this.swapPage.swapInputsButton.click();
    const afterSwapPrice = await this.getCurrentPriceFromSwap(timeouts.xxs);
    return { beforeSwapPrice, afterSwapPrice };
  }

  async getCurrentPriceFromSwap(waitTimeout?: number): Promise<string> {
    waitTimeout &&
      (await waiterHelper.sleep(waitTimeout, {
        sleepReason: "re-calculating after swapping inputs",
      }));
    return this.swapPage.currentPriceLabel.getText();
  }

  async getCurrentPriceFromConfirmation(): Promise<string> {
    return (await this.confirmSwapPage.currentPriceLabel.getText()).replace(
      ":",
      "~",
    );
  }

  async expectSuccessfulTransaction(context: BrowserContext): Promise<void> {
    expect(await this.isSwapPerformingPopupThere()).toBeTruthy();
    expect(await this.isApproveCompleteNotificationThere()).toBeTruthy();
    expect(await this.isSwapCompleteNotificationThere()).toBeTruthy();
    expect(await this.isTransactionSuccess(context)).toBeTruthy();
  }

  async navigateToCeloExplorer(): Promise<void> {
    await this.confirmSwapPage.seeDetailsLinkButton.click();
  }

  async useFullBalance(): Promise<void> {
    await this.swapPage.useMaxButton.click();
    await this.swapPage.considerKeepNotificationLabel.waitUntilDisplayed(
      timeouts.xs,
      { throwError: false },
    );
  }

  async isRejectedTransactionNotificationThere(): Promise<boolean> {
    return this.confirmSwapPage.rejectedTransactionNotificationLabel.isDisplayed();
  }

  async isAmountRequiredValidationThere(): Promise<boolean> {
    return this.swapPage.amountRequiredButton.isDisplayed();
  }

  async isAmountExceedValidationThere(): Promise<boolean> {
    return this.swapPage.amountExceedsBalanceButton.isDisplayed();
  }

  async isCurrentPriceThere(): Promise<boolean> {
    return this.swapPage.currentPriceLabel.isDisplayed();
  }

  async isSwapPerformingPopupThere(): Promise<boolean> {
    return this.confirmSwapPage.swapPerformingPopupLabel.isDisplayed();
  }

  async isApproveCompleteNotificationThere(): Promise<boolean> {
    return this.confirmSwapPage.approveCompleteNotificationLabel.isDisplayed();
  }

  async isSwapCompleteNotificationThere(): Promise<boolean> {
    return this.confirmSwapPage.swapCompleteNotificationLabel.waitUntilDisplayed(
      timeouts.l,
      { throwError: false },
    );
  }

  async isTransactionSuccess(context: BrowserContext): Promise<boolean> {
    const [newPage] = await Promise.all([
      context.waitForEvent("page"),
      this.navigateToCeloExplorer(),
    ]);
    const swapTransactionStatusLabel =
      await this.celoExplorerPage.getSwapTransactionStatusLabel(newPage);
    return swapTransactionStatusLabel.waitUntilDisplayed(timeouts.xxxs, {
      throwError: false,
    });
  }

  async isConsiderKeepNotificationThere(): Promise<boolean> {
    return this.swapPage.considerKeepNotificationLabel.isDisplayed();
  }

  async isFromInputEmpty(): Promise<boolean> {
    return !Boolean((await this.swapPage.fromAmountInput.getValue()).length);
  }

  private async showSlippage(): Promise<void> {
    await this.swapPage.settingsButton.click();
    await this.swapPage.showSlippageButton.click();
  }
}
