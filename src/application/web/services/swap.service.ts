import { BaseService } from "@services/base.service";
import { SwapPo } from "@pageObjects/swap.po";
import { waiterHelper } from "@helpers/waiter/waiter.helper";
import { timeouts } from "@constants/timeouts.constants";
import { loggerHelper } from "@helpers/logger/logger.helper";
import {
  ISwapInputs,
  ISwapServiceArgs,
} from "@services/types/swap.service.types";
import {
  IFillFromOpts,
  ISelectTokensArgs,
  Slippage,
} from "@services/types/get-web-services.types";
import { ClassLog } from "@decorators/logger.decorators";
import { ConfirmSwapService } from "@services/confirm-swap.service";

const logger = loggerHelper.get("SwapService");

export interface ISwapService {
  start: () => Promise<void>;
  selectTokens: (args: ISelectTokensArgs) => Promise<void>;
  chooseSlippage: (slippage: Slippage) => Promise<void>;
  fillForm: (args: IFillFromOpts) => Promise<void>;
  continueToConfirmation: () => Promise<void>;
  swapInputs: () => Promise<ISwapInputs>;
  getCurrentPriceFromSwap: (waitTimeout?: number) => Promise<string>;
  isAmountRequiredValidationThere: () => Promise<boolean>;
  isAmountExceedValidationThere: () => Promise<boolean>;
  isCurrentPriceThere: () => Promise<boolean>;
  isConsiderKeepNotificationThere: () => Promise<boolean>;
  isFromInputEmpty: () => Promise<boolean>;
}

@ClassLog
export class SwapService extends BaseService implements ISwapService {
  protected override page: SwapPo = null;
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

  async useFullBalance(): Promise<void> {
    await this.page.useMaxButton.click();
    await this.page.considerKeepNotificationLabel.waitUntilDisplayed(
      timeouts.xs,
      { throwError: false },
    );
  }

  async isAmountRequiredValidationThere(): Promise<boolean> {
    return this.page.amountRequiredButton.isDisplayed();
  }

  async isAmountExceedValidationThere(): Promise<boolean> {
    return this.page.amountExceedsBalanceButton.isDisplayed();
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
}
