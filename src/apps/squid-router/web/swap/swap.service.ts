import { waiterHelper } from "@helpers/waiter/waiter.helper";
import { timeouts } from "@constants/timeouts.constants";
import { loggerHelper } from "@helpers/logger/logger.helper";
import { ClassLog } from "@decorators/logger.decorators";
import { expect } from "@fixtures/test.fixture";
import { SwapPage } from "./swap.page";
import { BaseService, IBaseServiceArgs } from "@shared/web/base/base.service";
import { Address } from "viem";
import { TokenSymbol } from "@mento-protocol/mento-sdk";

const log = loggerHelper.get("SwapService");

@ClassLog
export class SwapService extends BaseService {
  override page: SwapPage = null;

  constructor(args: ISwapServiceArgs) {
    const { page } = args;
    super(args);
    this.page = page;
  }

  async process({
    sellToken,
    buyToken,
    isSellAmount,
    amount,
  }: IProcessArgs): Promise<void> {
    await this.selectToken({ token: sellToken, isSellToken: true });
    await this.selectToken({ token: buyToken, isSellToken: false });
    await this.fillAmount({ isSellAmount, amount });
    await this.handleSwap();
  }

  async handleSwap(): Promise<void> {
    if (await this.isApprovalRequired()) {
      log.debug(
        "Confirms both approval and swap TXs because sufficient allowance is not exist yet",
      );
      await this.confirmBothTxs();
    } else {
      log.debug(
        "Confirms only swap TX because sufficient allowance already exists",
      );
      await this.confirmSwapTx();
    }
    await this.page.swapCompleteLabel.waitForDisplayed(timeouts.xl);
  }

  async isApprovalRequired(): Promise<boolean> {
    return await waiterHelper.retry(
      async () => {
        // check for approve button to be enabled because it is rendered always
        await waiterHelper.sleep(timeouts.xxs, {
          sleepReason: "Waiting for approve button to be enabled",
        });
        return this.page.approveButton.isEnabled();
      },
      3,
      {
        errorMessage: "Approval is not required",
        throwError: false,
      },
    );
  }

  async confirmBothTxs(): Promise<void> {
    await this.confirmApprovalTx();
    await this.page.swapButton.waitForDisplayed(timeouts.xl);
    await this.confirmSwapTx();
  }

  async confirmApprovalTx(): Promise<void> {
    await this.page.approveButton.click();
    await this.metamask.confirmTransaction();
    await this.metamask.confirmTransaction();
  }

  async confirmSwapTx(): Promise<void> {
    await this.page.swapButton.click();
    await this.metamask.confirmTransaction();
  }

  async fillAmount({ isSellAmount, amount }: IFillAmountArgs): Promise<void> {
    const amountInput = isSellAmount
      ? this.page.amountInputs.sell
      : this.page.amountInputs.buy;
    await amountInput.enterText(amount);
  }

  async openTokenPicker({
    isSellToken,
  }: {
    isSellToken: boolean;
  }): Promise<void> {
    const tokenSelector = isSellToken
      ? this.page.tokenSelectors.sell
      : this.page.tokenSelectors.buy;
    await waiterHelper.retry(
      async () => {
        await tokenSelector.click({ force: true });
        return this.page.allChainsButton.waitForDisplayed(timeouts.xs, {
          throwError: false,
        });
      },
      3,
      {
        errorMessage: "Failed to open token picker",
        throwError: false,
      },
    );
  }

  async enterTokenName(tokenName: string): Promise<void> {
    await this.page.tokenNameInput.enterText(tokenName);
  }

  async selectToken({ token, isSellToken }: ISelectTokenArgs): Promise<void> {
    await this.openTokenPicker({ isSellToken });
    await this.enterTokenName(token as string);
    await this.page.yourTokensLabel.waitForDisplayed(timeouts.m);
    const tokenButton = this.page.getTokenButtonByName(token as string);
    await tokenButton.waitForDisplayed(timeouts.xl);
    await tokenButton.click({ force: true });
    await this.page.allChainsButton.waitForDisappeared(timeouts.s);
  }

  async expectUpdatedBalance({
    walletAddress,
    tokenSymbol,
    initialBalance,
    shouldIncrease,
  }: IExpectUpdatedBalanceArgs): Promise<void> {
    const currentBalance = await this.contract.governance.getBalance({
      walletAddress,
      tokenSymbol,
    });
    shouldIncrease
      ? expect(currentBalance).toBeGreaterThan(initialBalance)
      : expect(currentBalance).toBeLessThan(initialBalance);
  }
}

interface IExpectUpdatedBalanceArgs {
  initialBalance: number;
  walletAddress: Address;
  tokenSymbol: TokenSymbol;
  shouldIncrease: boolean;
}

interface ISwapServiceArgs extends IBaseServiceArgs {
  page: SwapPage;
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

interface ISelectTokenArgs {
  token: TokenSymbol;
  isSellToken: boolean;
}
