import { BaseService, IBaseServiceArgs } from "@shared/web/base/base.service";
import { loggerHelper } from "@helpers/logger/logger.helper";
import { ClassLog } from "@decorators/logger.decorators";
import { processEnv } from "@helpers/processEnv/processEnv.helper";
import { Token } from "@constants/token.constants";
import { waiterHelper } from "@helpers/waiter/waiter.helper";
import { timeouts } from "@constants/timeouts.constants";
import { expect } from "@fixtures/test.fixture";
import { testUtils } from "@helpers/suite/suite.helper";
import { primitiveHelper } from "@helpers/primitive/primitive.helper";
import { MainAppMentoPage } from "./main.page";
import {
  ConnectWalletModalService,
  WalletName,
} from "@shared/web/connect-wallet-modal/connect-wallet-modal.service";
import { SettingsService } from "../settings/settings.service";

const log = loggerHelper.get("MainAppMentoService");

@ClassLog
export class MainAppMentoService extends BaseService {
  public override page: MainAppMentoPage = null;
  public connectWalletModal: ConnectWalletModalService = null;
  public settings: SettingsService = null;

  constructor(args: IMainServiceArgs) {
    const { page, connectWalletModal, settings } = args;
    super(args);
    this.page = page;
    this.connectWalletModal = connectWalletModal;
    this.settings = settings;
  }

  async runSwapTestPreconditions() {
    await this.connectWalletByName(WalletName.Metamask);
    await this.waitForBalanceToLoad({ shouldOpenSettings: true });
  }

  async openConnectWalletModalFromHeader(): Promise<void> {
    await this.page.headerConnectWalletButton.click();
    await this.connectWalletModal.page.verifyIsOpen();
  }

  async openConnectWalletModal(): Promise<void> {
    await this.page.connectWalletButton.click();
    await this.connectWalletModal.page.verifyIsOpen();
  }

  async openSettings(): Promise<void> {
    await this.page.walletSettingsButton.click();
    await this.settings.page.verifyIsOpen();
  }

  async closeWalletSettings(): Promise<void> {
    await this.page.walletSettingsButton.click();
    await this.settings.page.verifyIsClosed();
  }

  async openSwitchNetwork(): Promise<void> {
    await this.openSettings();
    await this.settings.page.changeNetworkButton.click();
    await this.settings.switchNetworksPage.verifyIsOpen();
  }

  async openAppWithConnectedWallet(
    walletName = WalletName.Metamask,
  ): Promise<void> {
    processEnv.WALLET_ADDRESS = await this.metamask.getAddress();
    if (!(await this.isWalletConnected())) {
      return await this.connectWalletByName(walletName);
    }
    log.debug(`'${walletName}' wallet is already connected`);
  }

  async connectWalletByName(walletName: WalletName): Promise<void> {
    await this.openConnectWalletModalFromHeader();
    await this.connectWalletModal.selectWalletByName(walletName);
    await this.metamask.connectWallet();
  }

  async isWalletConnected(): Promise<boolean> {
    return !(await this.page.headerConnectWalletButton.isDisplayed());
  }

  async getTokenBalanceByName(
    tokenName: Token,
    {
      shouldOpenSettings = false,
      shouldCloseSettings = false,
      throwError = true,
    }: IGetTokenBalanceByNameOpts = {},
  ): Promise<number> {
    shouldOpenSettings && (await this.openSettings());
    const balanceText = await this.settings.page
      .getTokenBalanceLabelByName(tokenName)
      .getText({ throwError });
    const tokenBalance = primitiveHelper.number.toAmount(balanceText);
    shouldCloseSettings && (await this.closeWalletSettings());
    return tokenBalance;
  }

  async waitForBalanceToIncrease({
    initialBalance,
    tokenName,
  }: IWaitForBalanceToChangeArgs): Promise<boolean> {
    await this.openSettings();
    return waiterHelper.wait(
      async () => {
        const currentBalance = await this.getTokenBalanceByName(tokenName);
        return currentBalance > initialBalance;
      },
      timeouts.xxl,
      {
        throwError: false,
        interval: timeouts.xxs,
        errorMessage: `Current balance still equals to initial balance: '${initialBalance}'`,
      },
    );
  }

  async waitForBalanceToLoad({
    shouldOpenSettings = false,
    shouldCloseSettings = false,
    tokenToCheck = Token.CELO,
    throwError = true,
    shouldVerifyBalanceLoadingError = true,
  }: IWaitForBalanceToLoadOptions = {}): Promise<boolean> {
    shouldOpenSettings && (await this.openSettings());
    const isBalanceLoaded = waiterHelper.wait(
      async () => {
        const result = await this.settings.page
          .getTokenBalanceLabelByName(tokenToCheck)
          .isDisplayed();
        if (!result && shouldVerifyBalanceLoadingError) {
          await this.verifyErrorRetrievingBalances();
        }
        result && log.info("Balance is loaded successfully!");
        return result;
      },
      timeouts.xxl,
      {
        throwError,
        interval: timeouts.xxs,
        errorMessage: `Balance is still not loaded`,
      },
    );
    shouldCloseSettings && (await this.closeWalletSettings());
    return isBalanceLoaded;
  }

  private async verifyErrorRetrievingBalances(): Promise<void> {
    return (await this.isErrorRetrievingBalances())
      ? testUtils.disableInRuntime(
          {
            reason: "Error retrieving account balances",
          },
          "'Error retrieving account balances' case",
        )
      : log.debug("Error retrieving account balances is not defined");
  }

  private async isErrorRetrievingBalances({
    retryCount = 1,
  }: IsErrorRetrievingBalances = {}): Promise<boolean> {
    return waiterHelper.retry(
      async () => {
        return this.browser.hasConsoleErrorsMatchingText(
          "Failed to retrieve balances",
        );
      },
      retryCount,
      {
        interval: timeouts.xxxxs,
        throwError: false,
        continueWithException: true,
        errorMessage: "Checking for a 'error retrieving account balances' case",
      },
    );
  }

  async expectIncreasedBalance({
    initialBalance,
    tokenName,
  }: IWaitForBalanceToChangeArgs): Promise<void> {
    await this.waitForBalanceToIncrease({
      initialBalance,
      tokenName,
    });
    expect(
      await this.getTokenBalanceByName(tokenName, {
        shouldOpenSettings: false,
      }),
    ).toBeGreaterThan(initialBalance);
  }
}

interface IWaitForBalanceToLoadOptions {
  beforeChangeNetworkBalance?: number;
  tokenToCheck?: Token;
  shouldOpenSettings?: boolean;
  shouldCloseSettings?: boolean;
  shouldVerifyBalanceLoadingError?: boolean;
  throwError?: boolean;
}

interface IWaitForBalanceToChangeArgs {
  tokenName: Token;
  initialBalance: number;
}

interface IGetTokenBalanceByNameOpts {
  shouldOpenSettings?: boolean;
  shouldCloseSettings?: boolean;
  throwError?: boolean;
}

interface IsErrorRetrievingBalances {
  retryCount?: number;
}

export interface IMainServiceArgs extends IBaseServiceArgs {
  page: MainAppMentoPage;
  connectWalletModal: ConnectWalletModalService;
  settings: SettingsService;
}
