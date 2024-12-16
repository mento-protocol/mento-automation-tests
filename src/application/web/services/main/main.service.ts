import {
  IMainService,
  IMainServiceArgs,
  ConnectWalletModalService,
  WalletSettingsPopupService,
  WalletName,
  BaseService,
} from "@services/index";
import { loggerHelper } from "@helpers/logger/logger.helper";
import { ClassLog } from "@decorators/logger.decorators";
import { processEnv } from "@helpers/processEnv/processEnv.helper";
import { IWallet } from "@fixtures/common/common.fixture.types";
import { NetworkDetailsModalService } from "@services/index";
import { MainPo } from "@page-objects/index";
import { Token } from "@constants/token.constants";

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

  async getTokenBalanceByName(tokenName: Token): Promise<number> {
    await this.openWalletSettings();
    const tokenBalanceText = await this.walletSettingsPopup.page
      .getTokenBalanceLabelByName(tokenName)
      .getText();
    return Number(tokenBalanceText);
  }
}
