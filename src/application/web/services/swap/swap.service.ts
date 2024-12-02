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
    await this.page.continueButton.click();
    await this.confirm.page.verifyIsOpen();
    await waiterHelper.retry(
      async () => {
        await this.confirm.page.swapButton.click();
        return this.confirm.page.swapPerformingPopupLabel.waitUntilDisplayed(
          timeouts.xxs,
        );
      },
      3,
      { resolveWhenNoException: true, errorMessage: "couldn't start swapping" },
    );
  }

  async selectTokens(args: ISelectTokensArgs): Promise<void> {
    args?.from &&
      (await this.page.fromTokenDropdown.selectOptionByName(args?.from));
    args?.to && (await this.page.toTokenDropdown.selectOptionByName(args?.to));
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
    await waiterHelper.sleep(timeouts.s, {
      sleepReason:
        "flaky incorrect continueButton state by fast pressing after entering amount",
    });
  }

  async continueToConfirmation(): Promise<void> {
    return this.page.continueButton.click();
  }

  async swapInputs(): Promise<ISwapInputs> {
    const beforeSwapPrice = await this.getCurrentPriceFromSwap();
    await this.page.swapInputsButton.click();
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
    await this.page.useMaxButton.click();
    await this.page.considerKeepNotificationLabel.waitUntilDisplayed(
      timeouts.xs,
      { throwError: false },
    );
  }

  async isContinueButtonThere(): Promise<boolean> {
    return this.page.continueButton.isDisplayed();
  }

  async isAmountRequiredValidationThere(): Promise<boolean> {
    return this.page.amountRequiredButton.isDisplayed();
  }

  async isAmountExceedValidationThere(): Promise<boolean> {
    return this.page.amountExceedsBalanceButton.isDisplayed();
  }

  async isAmountTooSmallValidationThere(): Promise<boolean> {
    return this.page.amountTooSmallButton.isDisplayed();
  }

  async isErrorValidationThere(): Promise<boolean> {
    return this.page.errorButton.isDisplayed();
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
    return !Boolean((await this.page.fromAmountInput.getValue()).length);
  }

  async isNoValidMedian(): Promise<boolean> {
    return !(await this.isCurrentPriceLoaded())
      ? waiterHelper.retry(
          async () => {
            return this.browser.hasConsoleErrorsMatchingText("no valid median");
          },
          3,
          {
            throwError: false,
            continueWithException: true,
            errorMessage: "Checking for a 'no valid median' case",
          },
        )
      : false;
  }

  async isCurrentPriceLoaded(): Promise<boolean> {
    return (await this.page.currentPriceLabel.getText()) !== "...";
  }
}
