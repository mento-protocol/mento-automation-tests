import { BaseService, IBaseServiceArgs } from "@shared/web/base/base.service";
import { loggerHelper } from "@helpers/logger/logger.helper";
import { ClassLog } from "@decorators/logger.decorators";
import { processEnv } from "@helpers/processEnv/processEnv.helper";
import {
  ConnectWalletModalService,
  WalletName,
} from "@shared/web/connect-wallet-modal/connect-wallet-modal.service";
import { MainGovernancePage } from "./main.page";

const logger = loggerHelper.get("MainGovernanceService");

@ClassLog
export class MainGovernanceService extends BaseService {
  public override page: MainGovernancePage = null;
  public connectWalletModal: ConnectWalletModalService = null;

  constructor(args: IMainGovernanceServiceArgs) {
    const { page, connectWalletModal } = args;
    super(args);
    this.page = page;
    this.connectWalletModal = connectWalletModal;
  }

  async openConnectWalletModal(): Promise<void> {
    await this.page.headerConnectWalletButton.click();
    await this.connectWalletModal.page.verifyIsOpen();
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
    await this.openConnectWalletModal();
    await this.connectWalletModal.selectWalletByName(walletName);
    await this.metamaskHelper.connectWallet();
  }

  async isWalletConnected(): Promise<boolean> {
    return !(await this.page.headerConnectWalletButton.isDisplayed());
  }
}

export interface IMainGovernanceServiceArgs extends IBaseServiceArgs {
  page: MainGovernancePage;
  connectWalletModal: ConnectWalletModalService;
}
