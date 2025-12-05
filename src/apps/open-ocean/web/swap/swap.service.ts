import { Address } from "viem";

import { timeouts } from "@constants/timeouts.constants";
import { ClassLog } from "@decorators/logger.decorators";
import { expect } from "@fixtures/test.fixture";
import { BaseService, IBaseServiceArgs } from "@shared/web/base/base.service";
import { TokenSymbol } from "@mento-protocol/mento-sdk";
import { ConfirmModalPage } from "./confirm-modal.page";
import { ConfirmOrderPopupPage } from "./confirm-order-popup.page";
import { OpenOceanSwapPage } from "./swap.page";
import { magicStrings } from "@constants/magic-strings.constants";
import { waiterHelper } from "@helpers/waiter/waiter.helper";

@ClassLog
export class OpenOceanSwapService extends BaseService {
  override page: OpenOceanSwapPage = null;
  confirmModalPage: ConfirmModalPage = null;
  confirmOrderPopupPage: ConfirmOrderPopupPage = null;

  constructor(args: IOpenOceanSwapServiceArgs) {
    const { page, confirmModalPage, confirmOrderPopupPage } = args;
    super(args);
    this.page = page;
    this.confirmModalPage = confirmModalPage;
    this.confirmOrderPopupPage = confirmOrderPopupPage;
  }

  async selectTokens({
    sellToken,
    buyToken,
  }: {
    sellToken: TokenSymbol;
    buyToken: TokenSymbol;
  }): Promise<void> {
    return this.browser.openUrl(
      `${magicStrings.url["open-ocean"].web.prod.base}/swap/celo/${sellToken}/${buyToken}`,
    );
  }

  async clearAmount({
    isSellAmount,
  }: {
    isSellAmount: boolean;
  }): Promise<void> {
    const amountInput = isSellAmount
      ? this.page.amountInputs.sell
      : this.page.amountInputs.buy;
    // Clear to 0 first and then use backspace to clear the rest
    await amountInput.clear();
    await this.browser.pressButton("ArrowRight");
    await amountInput.clear({ shouldUseBackspace: true });
  }

  async fillAmount({ isSellAmount, amount }: IFillAmountArgs): Promise<void> {
    const amountInput = isSellAmount
      ? this.page.amountInputs.sell
      : this.page.amountInputs.buy;
    await this.clearAmount({ isSellAmount });
    await amountInput.enterText(amount, { force: true });
    await this.page.reviewButton.waitForDisplayed(timeouts.m, {
      errorMessage: "Review button is not displayed!",
    });
  }

  async process({
    sellToken,
    buyToken,
    isSellAmount,
    amount,
  }: IProcessArgs): Promise<void> {
    await this.selectTokens({ sellToken, buyToken });
    await this.fillAmount({ isSellAmount, amount });
    await this.swap();
  }

  async expectUpdatedBalance({
    walletAddress,
    tokenSymbol,
    initialBalance,
    shouldIncrease,
  }: IExpectUpdatedBalanceArgs): Promise<void> {
    const currentBalance =
      await this.contract.governance.getBalanceByTokenSymbol({
        walletAddress,
        tokenSymbol,
      });
    await waiterHelper.wait(
      async () => {
        return currentBalance !== initialBalance;
      },
      timeouts.m,
      {
        errorMessage: "Balance is not updated!",
        throwError: false,
      },
    );
    shouldIncrease
      ? expect(currentBalance).toBeGreaterThan(initialBalance)
      : expect(currentBalance).toBeLessThan(initialBalance);
  }

  async isApprovalTxNeeded(): Promise<boolean> {
    await waiterHelper.waitForAnimation();
    return await this.confirmOrderPopupPage.pendingApprovalLabel.waitForDisplayed(
      timeouts.xs,
      { throwError: false, errorMessage: "Approval not needed" },
    );
  }

  private async swap(): Promise<void> {
    await this.page.reviewButton.click();
    await this.confirmModalPage.verifyIsOpen();
    await this.confirmModalPage.confirmOrderButton.click();
    await this.confirmOrderPopupPage.verifyIsOpen();
    (await this.isApprovalTxNeeded())
      ? await this.confirmApprovalTx()
      : await this.confirmSignatureTx();
    await this.confirmSwapTx();
    await this.confirmModalPage.congratulationsLabel.waitForDisplayed(
      timeouts.m,
      {
        errorMessage: "Swap hasn't been completed successfully on UI!",
        throwError: false,
      },
    );
  }

  async confirmApprovalTx(): Promise<void> {
    await this.confirmOrderPopupPage.pendingApprovalLabel.waitForDisplayed(
      timeouts.m,
      {
        errorMessage: "'Pending approval' label is not displayed!",
      },
    );
    await this.metamask.confirmTransaction();
  }

  async confirmSignatureTx(): Promise<void> {
    await this.confirmOrderPopupPage.signMessageDescriptionLabel.waitForDisplayed(
      timeouts.m,
      {
        errorMessage: "'Sign message description' label is not displayed!",
      },
    );
    await this.metamask.rawModule.confirmSignature();
  }

  async confirmSwapTx(): Promise<void> {
    await this.confirmOrderPopupPage.signMessageDescriptionLabel.waitForDisplayed(
      timeouts.m,
      {
        errorMessage: "Sign message description label is not displayed!",
      },
    );
    await this.metamask.confirmTransaction();
  }
}

interface IExpectUpdatedBalanceArgs {
  initialBalance: number;
  walletAddress: Address;
  tokenSymbol: TokenSymbol;
  shouldIncrease: boolean;
}

interface IOpenOceanSwapServiceArgs extends IBaseServiceArgs {
  page: OpenOceanSwapPage;
  confirmModalPage: ConfirmModalPage;
  confirmOrderPopupPage: ConfirmOrderPopupPage;
}

interface IProcessArgs {
  sellToken: TokenSymbol;
  buyToken: TokenSymbol;
  isSellAmount: boolean;
  amount: string;
}

interface IFillAmountArgs {
  isSellAmount: boolean;
  amount: string;
}
