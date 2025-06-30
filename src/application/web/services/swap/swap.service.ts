import {
  BaseService,
  AmountType,
  IFillFromOpts,
  ISelectTokensArgs,
  ISwapInputs,
  ISwapServiceArgs,
  ConfirmSwapService,
  Slippage,
  ISwapInputsParams,
  IWaitForLoadedRateParams,
} from "@services/index";
import { SwapPo } from "@page-objects/index";
import { waiterHelper } from "@helpers/waiter/waiter.helper";
import { timeouts } from "@constants/timeouts.constants";
import { loggerHelper } from "@helpers/logger/logger.helper";
import { ClassLog } from "@decorators/logger.decorators";
import { SelectTokenModalPo } from "@page-objects/select-token-modal/select-token-modal.po";
import { SlippageModalPo } from "@page-objects/slippage-modal/slippage-modal.po";
import { Token } from "@constants/token.constants";
import { expect } from "@fixtures/common/common.fixture";

const logger = loggerHelper.get("SwapService");

@ClassLog
export class SwapService extends BaseService {
  override page: SwapPo = null;
  selectTokenModalPage: SelectTokenModalPo = null;
  slippageModalPage: SlippageModalPo = null;
  confirm: ConfirmSwapService = null;

  constructor(args: ISwapServiceArgs) {
    const { page, confirm, selectTokenModalPage, slippageModalPage } = args;
    super(args);
    this.page = page;
    this.confirm = confirm;
    this.selectTokenModalPage = selectTokenModalPage;
    this.slippageModalPage = slippageModalPage;
  }

  async proceedToConfirmation({
    shouldVerifyNoValidMedian = true,
  }: { shouldVerifyNoValidMedian?: boolean } = {}): Promise<void> {
    shouldVerifyNoValidMedian && (await this.confirm.verifyNoValidMedianCase());
    if (await this.page.approveButton.isDisplayed()) {
      await this.page.approveButton.click({ timeout: timeouts.s });
      await this.confirm.confirmApprovalTx();
    } else {
      await this.page.swapButton.click();
    }
  }

  async start(): Promise<void> {
    await this.confirm.verifyNoValidMedianCase();
    if (await this.page.approveButton.isDisplayed()) {
      logger.debug(
        "Confirms both approval and swap TXs because sufficient allowance is not exist yet",
      );
      await this.confirm.confirmBothTxs();
    } else {
      logger.debug(
        "Confirms only swap TX because sufficient allowance already exists",
      );
      await this.page.swapButton.click();
      await this.confirm.page.verifyIsOpen();
      await this.confirm.confirmSwapTx();
    }
  }

  async chooseSlippage(
    slippage: Slippage,
    customSlippage?: string,
  ): Promise<void> {
    await this.openSlippageModal();
    customSlippage?.length
      ? await this.slippageModalPage.customSlippageInput.enterText(
          customSlippage,
        )
      : await this.slippageModalPage.slippageButtons[slippage].click();
    await this.slippageModalPage.confirmButton.click();
    await this.slippageModalPage.verifyIsClosed();
  }

  private async openSlippageModal(): Promise<void> {
    await this.page.slippageButton.click({
      force: true,
      timeout: timeouts.s,
      times: 2,
    });
    await this.slippageModalPage.verifyIsOpen();
  }

  async fillForm(opts: IFillFromOpts): Promise<void> {
    const { slippage, sellAmount, buyAmount, tokens, clicksOnSellTokenButton } =
      opts;
    slippage && (await this.chooseSlippage(slippage));
    await this.selectTokens({ clicksOnSellTokenButton, ...tokens });
    // TODO: Sort out why we need to click on the input before filling when it's only filling
    sellAmount &&
      (await this.page.sellAmountInput.click({
        force: true,
        timeout: timeouts.xs,
      }));
    sellAmount &&
      (await this.page.sellAmountInput.enterText(sellAmount, { force: true }));
    buyAmount && (await this.page.buyAmountInput.click({ force: true }));
    buyAmount &&
      (await this.page.buyAmountInput.enterText(buyAmount, {
        force: true,
        timeout: timeouts.xs,
      }));
    await this.waitForLoadedRate();
  }

  async swapInputs({
    shouldReturnRates = true,
    clicksOnButton = 1,
  }: ISwapInputsParams = {}): Promise<ISwapInputs | undefined> {
    const beforeSwapRate = shouldReturnRates && (await this.getRate());
    await this.page.swapInputsButton.click({
      timeout: timeouts.xxs,
      force: true,
      times: clicksOnButton,
    });
    shouldReturnRates &&
      (await this.waitForLoadedRate({ timeout: timeouts.m, throwError: true }));
    const afterSwapRate = shouldReturnRates && (await this.getRate());
    return (
      shouldReturnRates && {
        beforeSwapRate,
        afterSwapRate,
      }
    );
  }

  async getRate(): Promise<string> {
    return this.page.rateLabel.getText();
  }

  async isInsufficientBalanceButtonThere(): Promise<boolean> {
    return this.page.insufficientBalanceButton.isDisplayed();
  }

  async isSwapsExceedsLimitsButtonThere(): Promise<boolean> {
    return this.page.swapsExceedsLimitsButton.isDisplayed();
  }

  async getCurrentBuyTokenName(): Promise<string> {
    return this.page.selectBuyTokenButton.getText();
  }

  async getCurrentSellTokenName(): Promise<string> {
    return this.page.selectSellTokenButton.getText();
  }

  async getSellTokenAmount(): Promise<string> {
    return this.page.sellAmountInput.getValue();
  }

  async getAmountByType(amountType: AmountType): Promise<string> {
    const amountInput =
      amountType === AmountType.Sell
        ? this.page.sellAmountInput
        : this.page.buyAmountInput;
    return amountInput.getValue();
  }

  async getUsdAmountByType(amountType: AmountType): Promise<string> {
    const amountInput =
      amountType === AmountType.Sell
        ? this.page.sellUsdAmountLabel
        : this.page.buyUsdAmountLabel;
    return (await amountInput.getText()).replaceAll("~$", "");
  }

  async useFullBalance(): Promise<void> {
    await this.page.useMaxButton.click({
      timeout: timeouts.xxs,
      force: true,
      times: 2,
    });
    await this.page.considerKeepNotificationLabel.waitUntilDisplayed(
      timeouts.xs,
      { throwError: false },
    );
  }

  async isProceedButtonThere(): Promise<boolean> {
    return (
      (await this.page.swapButton.isDisplayed()) ||
      (await this.page.approveButton.isDisplayed())
    );
  }

  async isProceedButtonEnabled(): Promise<boolean> {
    return (await this.page.swapButton.isDisplayed())
      ? await this.page.swapButton.isEnabled()
      : await this.page.approveButton.isEnabled();
  }

  async isAmountRequiredValidationThere(): Promise<boolean> {
    return this.page.amountRequiredButton.waitUntilDisplayed(timeouts.s, {
      throwError: false,
    });
  }

  async isAmountExceedValidationThere(): Promise<boolean> {
    return this.page.insufficientBalanceButton.waitUntilDisplayed(timeouts.s, {
      throwError: false,
    });
  }

  async isErrorValidationThere(): Promise<boolean> {
    return this.page.errorButton.waitUntilDisplayed(timeouts.s, {
      throwError: false,
    });
  }

  async waitForExceedsTradingLimitsNotification(
    timeout: number,
  ): Promise<boolean> {
    return waiterHelper.wait(
      async () => this.page.exceedsTradingLimitNotificationLabel.isDisplayed(),
      timeout,
      {
        throwError: false,
        errorMessage: "'Exceeds trading limits' notification is not displayed",
      },
    );
  }

  async waitForExceedsTradingLimitsButton(timeout: number): Promise<boolean> {
    return waiterHelper.wait(
      async () => this.page.swapsExceedsLimitsButton.isDisplayed(),
      timeout,
      {
        throwError: false,
        errorMessage: "Swaps exceeds trading limits button is not displayed",
      },
    );
  }

  async getExceedsTradingLimitsErrorText(): Promise<string> {
    return this.page.exceedsTradingLimitNotificationLabel.getText();
  }

  async isRateThere(): Promise<boolean> {
    return (
      (await this.page.rateLabel.isDisplayed()) &&
      (await this.page.rateLabel.getText()) !== "..."
    );
  }

  async isConsiderKeepNotificationThere(): Promise<boolean> {
    return this.page.considerKeepNotificationLabel.isDisplayed();
  }

  async isAmountEmpty(amountType: AmountType): Promise<boolean> {
    const amountInput =
      amountType === AmountType.Sell
        ? this.page.sellAmountInput
        : this.page.buyAmountInput;
    return !(await amountInput.getValue())?.length;
  }

  async expectTokenOptionsMatch(expectedTokens: Token[]): Promise<void> {
    for (const expectedToken of expectedTokens) {
      expect
        .soft(
          await this.selectTokenModalPage.tokens[expectedToken].isDisplayed(),
          `${expectedToken} is not displayed`,
        )
        .toBeTruthy();
    }
  }

  async waitForLoadedRate({
    timeout = timeouts.s,
    throwError = false,
  }: IWaitForLoadedRateParams = {}): Promise<boolean> {
    const result = await waiterHelper.wait(
      async () => this.isRateLoaded(),
      timeout,
      {
        throwError,
        errorMessage: "Rate is not loaded!",
        interval: timeouts.action,
      },
    );
    result && logger.info(`Rate is loaded successfully!`);
    return result;
  }

  private async selectTokens(args: ISelectTokensArgs): Promise<void> {
    const { clicksOnSellTokenButton = 2 } = args;
    if (args?.sell) {
      await this.page.selectSellTokenButton.click({
        force: true,
        timeout: timeouts.s,
        times: clicksOnSellTokenButton,
      });
      await this.selectTokenModalPage.verifyIsOpen();
      await this.selectTokenModalPage.tokens[args?.sell].click({
        timeout: timeouts.xxs,
      });
      await this.selectTokenModalPage.verifyIsClosed();
      await this.page
        .getSelectedTokenLabel(args.sell)
        .waitUntilDisplayed(timeouts.xxs);
    }
    if (args?.buy) {
      await this.page.selectBuyTokenButton.click({
        force: true,
        timeout: timeouts.s,
      });
      await this.selectTokenModalPage.verifyIsOpen();
      await this.selectTokenModalPage.tokens[args.buy].click({
        timeout: timeouts.xxs,
      });
      await this.selectTokenModalPage.verifyIsClosed();
      await this.page
        .getSelectedTokenLabel(args.buy)
        .waitUntilDisplayed(timeouts.xxs);
    }
  }
}
