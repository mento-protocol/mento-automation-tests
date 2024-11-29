import { BaseService } from "./base.service";
import { MainPo } from "@pageObjects/main.po";
import { IMainServiceArgs } from "@services/types/main.service.types";
import { loggerHelper } from "@helpers/logger/logger.helper";
import { IWallet } from "@fixtures/common.fixture";
import { ClassLog } from "@decorators/logger.decorators";
import {
  ConnectWalletModalService,
  WalletName,
} from "@services/connect-wallet-modal.service";
import { WalletSettingsPopupService } from "@services/wallet-settings-popup.service";
import { processEnv } from "@helpers/processEnv/processEnv.helper";
import { NetworkDetailsModalService } from "@services/network-details-modal.service";

const logger = loggerHelper.get("MainService");

export interface IMainService {
  openConnectWalletModalFromHeader: () => Promise<void>;
  openConnectWalletModal: () => Promise<void>;
  openAppWithConnectedWallet: (
    wallet: IWallet,
    walletName: WalletName,
  ) => Promise<void>;
  connectWalletByName: (
    wallet: IWallet,
    walletName: WalletName,
  ) => Promise<void>;
  isWalletConnected: () => Promise<boolean>;
}

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

  async openNetworkDetails(): Promise<void> {
    await this.page.networkDetailsButton.click();
    await this.networkDetailsModal.page.verifyIsOpen();
  }

  async openAppWithConnectedWallet(
    wallet: IWallet,
    walletName = WalletName.Metamask,
  ): Promise<void> {
    await wallet.metamask.page.getByTestId("app-header-copy-button").click();
    await this.navigateToApp();
    processEnv.WALLET_ADDRESS = await this.browser.readFromClipboard();
    if (!(await this.isWalletConnected())) {
      return await this.connectWalletByName(wallet, walletName);
    }
    logger.debug(`'${walletName}' wallet is already connected`);
  }

  async connectWalletByName(
    wallet: IWallet,
    walletName: WalletName,
  ): Promise<void> {
    await this.openConnectWalletModalFromHeader();
    await this.connectWalletModal.selectWalletByName(walletName);
    await wallet.metamask.approve();
  }

  async isWalletConnected(): Promise<boolean> {
    return !(await this.page.headerConnectWalletButton.isDisplayed());
  }
}
