import { BaseService } from "./base.service";
import { MainPo } from "@pageObjects/main.po";
import { IMainServiceArgs } from "@services/types/main.service.types";
import { loggerHelper } from "@helpers/logger/logger.helper";
import { IWallet } from "@fixtures/common.fixture";
import { ClassLog } from "@decorators/logger.decorators";

const logger = loggerHelper.get("MainService");

export interface IMainService {
  openAppWithConnectedWallet: (wallet: IWallet) => Promise<void>;
  connectMetamaskWallet: (wallet: IWallet) => Promise<void>;
  isWalletConnected: () => Promise<boolean>;
}

@ClassLog
export class MainService extends BaseService implements IMainService {
  protected override page: MainPo = null;

  constructor(args: IMainServiceArgs) {
    const { page } = args;
    super(args);
    this.page = page;
  }

  async openAppWithConnectedWallet(wallet: IWallet): Promise<void> {
    await this.navigateToApp();
    if (!(await this.isWalletConnected())) {
      return await this.connectMetamaskWallet(wallet);
    }
    logger.debug("Wallet is already connected");
  }

  async connectMetamaskWallet(wallet: IWallet): Promise<void> {
    await this.page.connectButton.click();
    const firstWallet = this.page.walletTypeButtons.getElementByIndex(0);
    await firstWallet.click();
    await wallet.metamask.approve();
  }

  async isWalletConnected(): Promise<boolean> {
    logger.debug("Verifying wallet connected status");
    return !(await this.page.connectButton.isDisplayed());
  }
}
