import { BaseService, IBaseServiceArgs } from "@shared/web/base/base.service";
import { loggerHelper } from "@helpers/logger/logger.helper";
import { ClassLog } from "@decorators/logger.decorators";
import { processEnv } from "@helpers/processEnv/processEnv.helper";
import { Token } from "@constants/token.constants";
import { waiterHelper } from "@helpers/waiter/waiter.helper";
import { timeouts } from "@constants/timeouts.constants";
import { expect } from "@fixtures/test.fixture";
import { testHelper } from "@helpers/test/test.helper";
import { primitiveHelper } from "@helpers/primitive/primitive.helper";
import { MainAppMentoPage } from "./main.page";
import {
  ConnectWalletModalService,
  WalletName,
} from "@shared/web/connect-wallet-modal/connect-wallet-modal.service";
import { SettingsService } from "../settings/settings.service";
import { SwitchNetworksPage } from "../settings/switch-networks.page";
import { ChainName } from "@helpers/env/env.helper";

const log = loggerHelper.get("MainAppMentoService");

@ClassLog
export class MainAppMentoService extends BaseService {
  public override page: MainAppMentoPage = null;
  public connectWalletModal: ConnectWalletModalService = null;
  public settings: SettingsService = null;
  public switchNetworksPage: SwitchNetworksPage = null;

  constructor(args: IMainServiceArgs) {
    const { page, connectWalletModal, settings, switchNetworksPage } = args;
    super(args);
    this.page = page;
    this.connectWalletModal = connectWalletModal;
    this.settings = settings;
    this.switchNetworksPage = switchNetworksPage;
  }

  async enableForkMode(): Promise<void> {
    await this.browser.pressButton("Control+M+D");
    await this.page.debugPopup.button.waitForDisplayed(timeouts.xs);
    await this.page.debugPopup.button.click();
    await this.page.debugPopup.container.waitForDisplayed(timeouts.xs);
    await this.page.debugPopup.useForkedChainsButton.click();
    await this.page.verifyIsOpen();
  }

  async runSwapTestPreconditions({
    isFork = false,
  }: { isFork?: boolean } = {}) {
    isFork && (await this.enableForkMode());
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

  async openSwitchNetworkPopover(): Promise<void> {
    await this.page.changeNetworkButton.click();
    await this.switchNetworksPage.verifyIsOpen();
  }

  async getCurrentChainName(): Promise<ChainName> {
    const currentUrl = await this.browser.getCurrentPageUrl();
    if (currentUrl.includes("sepolia")) return ChainName.CeloSepolia;
    if (currentUrl.includes("celo")) return ChainName.Celo;
    if (currentUrl.includes("monad-testnet")) return ChainName.MonadTestnet;
    if (currentUrl.includes("monad")) return ChainName.Monad;
    throw new Error(`Unknown network: ${currentUrl}`);
  }

  async switchNetwork({
    networkName,
    shouldEnableTestnetMode = false,
  }: ISwitchNetworkParams): Promise<void> {
    if (shouldEnableTestnetMode) await this.enableTestnetMode();
    await this.openSwitchNetworkPopover();
    await this.switchNetworksPage.networkButtons[networkName].click();
    await this.metamask.approveNewNetwork();
    await this.metamask.approveSwitchNetwork();
    await this.switchNetworksPage.verifyIsClosed();
  }

  async waitForNetwork({
    chainName,
    timeout = timeouts.s,
    throwError = true,
  }: IWaitForNetworkParams): Promise<void> {
    await waiterHelper.wait(
      async () => {
        return (await this.getCurrentChainName()) === chainName;
      },
      timeout,
      { throwError },
    );
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

  async isTestnetModeEnabled(): Promise<boolean> {
    return this.settings.page.testnetModeCheckbox.isChecked();
  }

  async enableTestnetMode(): Promise<void> {
    await this.openSettings();
    if (await this.isTestnetModeEnabled()) {
      log.debug("Testnet mode is already enabled!");
      return;
    }
    await this.settings.page.testnetModeCheckbox.click();
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
      timeouts.xl,
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
    tokenToCheck = Token.USDm,
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
      ? testHelper.skipInRuntime(
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
  switchNetworksPage: SwitchNetworksPage;
}

interface ISwitchNetworkParams {
  networkName: ChainName;
  shouldEnableTestnetMode?: boolean;
}

interface IWaitForNetworkParams {
  chainName: ChainName;
  timeout?: number;
  throwError?: boolean;
}
