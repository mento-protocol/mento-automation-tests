import {
  BaseService,
  AmountType,
  IFillFromOpts,
  ISelectTokensArgs,
  ISwapInputs,
  ISwapService,
  ISwapServiceArgs,
  ConfirmSwapService,
  Slippage,
} from "@services/index";
import { SwapPo } from "@page-objects/index";
import { waiterHelper } from "@helpers/waiter/waiter.helper";
import { timeouts } from "@constants/timeouts.constants";
import { loggerHelper } from "@helpers/logger/logger.helper";
import { ClassLog } from "@decorators/logger.decorators";
import { testUtils } from "@helpers/suite/suite.helper";

const logger = loggerHelper.get("SwapService");

@ClassLog
export class SwapService extends BaseService implements ISwapService {
  public override page: SwapPo = null;
  public confirm: ConfirmSwapService = null;

  constructor(args: ISwapServiceArgs) {
    const { page, confirm } = args;
    super(args);
    this.page = page;
    this.confirm = confirm;
  }

  async start(): Promise<void> {
    await this.verifyNoValidMedianCase();
    await this.continueToConfirmation();
    await this.verifyTradingSuspendedCase();
    await waiterHelper.retry(
      async () => {
        await this.confirm.page.swapButton.waitUntilEnabled(timeouts.s);
        await this.confirm.page.swapButton.click();
        return this.confirm.page.swapPerformingPopupLabel.waitUntilDisplayed(
          timeouts.xs,
          { throwError: false },
        );
      },
      3,
      { resolveWhenNoException: true, errorMessage: "couldn't start swapping" },
    );
  }

  async selectTokens(args: ISelectTokensArgs): Promise<void> {
    args?.from &&
      (await this.page.fromTokenDropdown.selectOptionByName(args?.from, {
        timeout: timeouts.xxs,
      }));
    args?.to &&
      (await this.page.toTokenDropdown.selectOptionByName(args?.to, {
        timeout: timeouts.xxs,
      }));
  }

  async chooseSlippage(slippage: Slippage): Promise<void> {
    logger.debug(`Choosing the '${slippage}' slippage.`);
    await this.showSlippage();
    await this.page.maxSlippageButtons[slippage].jsClick();
  }

  private async showSlippage(): Promise<void> {
    await this.page.settingsButton.click();
    await this.page.showSlippageButton.click();
  }

  async fillForm(opts: IFillFromOpts): Promise<void> {
    const { slippage, fromAmount, toAmount, tokens } = opts;
    slippage && (await this.chooseSlippage(slippage));
    await this.selectTokens(tokens);
    fromAmount && (await this.page.fromAmountInput.enterText(fromAmount));
    toAmount && (await this.page.toAmountInput.enterText(toAmount));
    await this.waitForLoadedCurrentPrice();
  }

  async continueToConfirmation(): Promise<void> {
    await this.page.continueButton.click();
    await this.confirm.page.verifyIsOpen();
  }

  async swapInputs(): Promise<ISwapInputs> {
    const beforeSwapPrice = await this.getCurrentPriceFromSwap();
    await this.page.swapInputsButton.click();
    await this.waitForLoadedCurrentPrice();
    const afterSwapPrice = await this.getCurrentPriceFromSwap(timeouts.xxs);
    return { beforeSwapPrice, afterSwapPrice };
  }

  async getCurrentPriceFromSwap(waitTimeout?: number): Promise<string> {
    waitTimeout &&
      (await waiterHelper.sleep(waitTimeout, {
        sleepReason: "re-calculating after swapping inputs",
      }));
    return this.page.currentPriceLabel.getText();
  }

  async getCurrentToTokenName(): Promise<string> {
    return (await this.page.toTokenDropdown.getText()).replaceAll(
      "To Token",
      "",
    );
  }

  async getCurrentFromTokenName(): Promise<string> {
    return (await this.page.fromTokenDropdown.getText()).replaceAll(
      "From Token",
      "",
    );
  }

  async getAmountByType(amountType: AmountType): Promise<string> {
    const amountInput =
      amountType === AmountType.In
        ? this.page.fromAmountInput
        : this.page.toAmountInput;
    return amountInput.getValue();
  }

  async useFullBalance(): Promise<void> {
    await this.page.useMaxButton.click({ timeout: timeouts.xxs });
    await this.page.considerKeepNotificationLabel.waitUntilDisplayed(
      timeouts.xs,
      { throwError: false },
    );
  }

  async isContinueButtonThere(): Promise<boolean> {
    return this.page.continueButton.isDisplayed();
  }

  async isContinueButtonEnabled(): Promise<boolean> {
    return this.page.continueButton.isEnabled();
  }

  async isAmountRequiredValidationThere(): Promise<boolean> {
    return this.page.amountRequiredButton.waitUntilDisplayed(timeouts.s, {
      throwError: false,
    });
  }

  async isAmountExceedValidationThere(): Promise<boolean> {
    return this.page.amountExceedsBalanceButton.waitUntilDisplayed(timeouts.s, {
      throwError: false,
    });
  }

  async isAmountTooSmallValidationThere(): Promise<boolean> {
    return this.page.amountTooSmallButton.waitUntilDisplayed(timeouts.s, {
      throwError: false,
    });
  }

  async isErrorValidationThere(): Promise<boolean> {
    return this.page.errorButton.waitUntilDisplayed(timeouts.s, {
      throwError: false,
    });
  }

  async waitForExceedsTradingLimitsValidation(
    timeout: number,
  ): Promise<boolean> {
    return this.page.exceedsTradingLimitErrorLabel.waitUntilDisplayed(timeout);
  }

  async isCurrentPriceThere(): Promise<boolean> {
    return this.page.currentPriceLabel.isDisplayed();
  }

  async isConsiderKeepNotificationThere(): Promise<boolean> {
    return this.page.considerKeepNotificationLabel.isDisplayed();
  }

  async isFromInputEmpty(): Promise<boolean> {
    return !(await this.page.fromAmountInput.getValue()).length;
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

  async waitForLoadedCurrentPrice(): Promise<boolean> {
    return waiterHelper.wait(
      async () => this.isCurrentPriceLoaded(),
      timeouts.s,
      {
        throwError: false,
        errorMessage: "Current price is not loaded",
        interval: timeouts.xxxs,
      },
    );
  }

  private async isNoValidMedian(): Promise<boolean> {
    return !(await this.isCurrentPriceLoaded())
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

  private async isCurrentPriceLoaded(): Promise<boolean> {
    const currentPriceText = await this.page.currentPriceLabel.getText();
    return currentPriceText !== "...";
  }
}
