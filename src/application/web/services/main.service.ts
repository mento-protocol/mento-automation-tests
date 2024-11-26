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
  protected override page: MainPo = null;
  public connectWallet: ConnectWalletModalService = null;

  constructor(args: IMainServiceArgs) {
    const { page, connectWalletModal } = args;
    super(args);
    this.page = page;
    this.connectWallet = connectWalletModal;
  }

  async openConnectWalletModalFromHeader(): Promise<void> {
    await this.page.headerConnectWalletButton.click();
    await this.connectWallet.page.verifyIsOpen();
  }

  async openConnectWalletModal(): Promise<void> {
    await this.page.connectWalletButton.click();
    await this.connectWallet.page.verifyIsOpen();
  }

  async openAppWithConnectedWallet(
    wallet: IWallet,
    walletName = WalletName.Metamask,
  ): Promise<void> {
    await this.navigateToApp();
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
    await this.connectWallet.selectWalletByName(walletName);
    await wallet.metamask.approve();
  }

  async isWalletConnected(): Promise<boolean> {
    logger.debug("Verifying wallet connected status");
    return !(await this.page.headerConnectWalletButton.isDisplayed());
  }
}
