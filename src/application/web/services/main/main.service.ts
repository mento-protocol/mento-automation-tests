import {
  BaseService,
  ConnectWalletModalService,
  IMainService,
  IMainServiceArgs,
  Network,
  NetworkDetailsModalService,
  WalletName,
  WalletSettingsPopupService,
} from "@services/index";
import { loggerHelper } from "@helpers/logger/logger.helper";
import { ClassLog } from "@decorators/logger.decorators";
import { processEnv } from "@helpers/processEnv/processEnv.helper";
import { MainPo } from "@page-objects/index";
import { Token } from "@constants/token.constants";
import { waiterHelper } from "@helpers/waiter/waiter.helper";
import { timeouts } from "@constants/timeouts.constants";
import { expect } from "@fixtures/common/common.fixture";
import { envHelper } from "@helpers/env/env.helper";

const logger = loggerHelper.get("MainService");

@ClassLog
export class MainService extends BaseService implements IMainService {
  public override page: MainPo = null;
  public connectWalletModal: ConnectWalletModalService = null;
  public walletSettingsPopup: WalletSettingsPopupService = null;
  public networkDetailsModal: NetworkDetailsModalService = null;

  constructor(args: IMainServiceArgs) {
    const {
      page,
      connectWalletModal,
      walletSettingsPopup,
      networkDetailsModal,
    } = args;
    super(args);
    this.page = page;
    this.connectWalletModal = connectWalletModal;
    this.walletSettingsPopup = walletSettingsPopup;
    this.networkDetailsModal = networkDetailsModal;
  }

  async runSwapTestPreconditions() {
    await this.connectWalletByName(WalletName.Metamask);
    await this.openWalletSettings();
    !envHelper.isMainnet() &&
      (await this.switchNetwork({
        networkName: Network.Alfajores,
      }));
    await this.waitForBalanceToLoad();
  }

  async openConnectWalletModalFromHeader(): Promise<void> {
    await this.page.headerConnectWalletButton.click();
    await this.connectWalletModal.page.verifyIsOpen();
  }

  async openConnectWalletModal(): Promise<void> {
    await this.page.connectWalletButton.click();
    await this.connectWalletModal.page.verifyIsOpen();
  }

  async openWalletSettings(): Promise<void> {
    await this.page.walletSettingsButton.click();
    await this.walletSettingsPopup.page.verifyIsOpen();
  }

  async closeWalletSettings(): Promise<void> {
    await this.page.walletSettingsButton.click();
    await this.walletSettingsPopup.page.verifyIsClosed();
  }

  async openNetworkDetails(): Promise<void> {
    await this.page.networkDetailsButton.click();
    await this.networkDetailsModal.page.verifyIsOpen();
  }

  async openAppWithConnectedWallet(
    walletName = WalletName.Metamask,
  ): Promise<void> {
    processEnv.WALLET_ADDRESS = await this.metamaskHelper.getAddress();
    if (!(await this.isWalletConnected())) {
      return await this.connectWalletByName(walletName);
    }
    logger.debug(`'${walletName}' wallet is already connected`);
  }

  async connectWalletByName(walletName: WalletName): Promise<void> {
    await this.openConnectWalletModalFromHeader();
    await this.connectWalletModal.selectWalletByName(walletName);
    await this.metamaskHelper.connectWallet();
  }

  async isWalletConnected(): Promise<boolean> {
    return !(await this.page.headerConnectWalletButton.isDisplayed());
  }

  async getTokenBalanceByName(
    tokenName: Token,
    {
      shouldOpenSettings = false,
      shouldCloseSettings = false,
    }: IGetTokenBalanceByNameOpts = {},
  ): Promise<number> {
    shouldOpenSettings && (await this.openWalletSettings());
    const tokenBalance = Number(
      await this.walletSettingsPopup.page
        .getTokenBalanceLabelByName(tokenName)
        .getText(),
    );
    shouldCloseSettings && (await this.closeWalletSettings());
    return tokenBalance;
  }

  async waitForBalanceToIncrease({
    initialBalance,
    tokenName,
  }: IWaitForBalanceToChangeArgs): Promise<boolean> {
    await this.openWalletSettings();
    return waiterHelper.wait(
      async () => {
        const currentBalance = await this.getTokenBalanceByName(tokenName);
        return currentBalance > initialBalance;
      },
      timeouts.xxl,
      {
        throwError: false,
        interval: timeouts.xxs,
        errorMessage: `Current balance still less than '${initialBalance}' initial balance`,
      },
    );
  }

  async waitForBalanceToLoad({
    shouldOpenSettings = false,
    shouldCloseSettings = false,
    tokenToCheck = Token.CELO,
  }: IWaitForBalanceToLoadOptions = {}): Promise<boolean> {
    shouldOpenSettings && (await this.openWalletSettings());
    const isBalanceLoaded = waiterHelper.wait(
      async () => {
        const result = await this.walletSettingsPopup.page
          .getTokenBalanceLabelByName(tokenToCheck)
          .isDisplayed();
        result && logger.info("Balance is loaded successfully!");
        return result;
      },
      timeouts.xl,
      {
        throwError: false,
        interval: timeouts.xxs,
        errorMessage: `Balance is still not loaded`,
      },
    );
    shouldCloseSettings && (await this.closeWalletSettings());
    return isBalanceLoaded;
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

  async switchNetwork({
    networkName,
    shouldOpenSettings = false,
    shouldCloseSettings = false,
  }: ISwitchNetworkArgs): Promise<void> {
    shouldOpenSettings && (await this.openWalletSettings());
    const balanceBeforeChangeNetwork = await this.getTokenBalanceByName(
      Token.CELO,
    );
    await this.walletSettingsPopup.openNetworkDetails();
    await this.walletSettingsPopup.networkDetails.switchNetworkByName(
      networkName,
      { shouldClosePopup: true },
    );
    // workaround until fix https://linear.app/mento-labs/issue/SUP-159/
    await this.openWalletSettings();
    await waiterHelper.wait(
      async () => {
        const currentBalance = await this.getTokenBalanceByName(Token.CELO);
        return balanceBeforeChangeNetwork !== currentBalance;
      },
      timeouts.xl,
      {
        throwError: false,
        interval: timeouts.xxxs,
        errorMessage: `Balance is not equal to '${networkName}' network'`,
      },
    );
    shouldCloseSettings && (await this.closeWalletSettings());
  }
}

interface ISwitchNetworkArgs {
  networkName: Network;
  shouldOpenSettings?: boolean;
  shouldCloseSettings?: boolean;
}

interface IWaitForBalanceToLoadOptions {
  beforeChangeNetworkBalance?: number;
  tokenToCheck?: Token;
  shouldOpenSettings?: boolean;
  shouldCloseSettings?: boolean;
}

interface IWaitForBalanceToChangeArgs {
  tokenName: Token;
  initialBalance: number;
}

interface IGetTokenBalanceByNameOpts {
  shouldOpenSettings?: boolean;
  shouldCloseSettings?: boolean;
}
