import { BaseService } from "./base.service";
import { MainPo } from "../pageObjects/main.po";
import { IMainService, IMainServiceArgs } from "./types/main.service.types";
import { loggerHelper } from "@helpers/logger/logger.helper";
import { IWallet } from "@fixtures/common.fixture";
import { envHelper } from "@helpers/env/env.helper";
import { ClassLog } from "@decorators/logger.decorators";

const logger = loggerHelper.get("MainService");

@ClassLog
export class MainService extends BaseService implements IMainService {
  protected page: MainPo = null;

  constructor(args: IMainServiceArgs) {
    const { page } = args;
    super(args);
    this.page = page;
  }

  async setupPlatformPreconditions(wallet: IWallet): Promise<void> {
    await this.openUrl(envHelper.getBaseWebUrl());
    !(await this.isWalletConnected()) &&
      (await this.connectMetamaskWallet(wallet));
  }

  async connectMetamaskWallet(wallet: IWallet): Promise<void> {
    logger.debug("Connecting Metamask wallet...");
    await this.page.connectButton.click();
    const firstWallet = this.page.walletTypeButtons.getElementByIndex(0);
    await firstWallet.click();
    console.log({ wallet });
    await wallet.metamask.approve();
    logger.info("Metamask wallet has been successfully connected", {
      shouldAddStep: true,
    });
  }

  async isWalletConnected(): Promise<boolean> {
    logger.debug("Verifying wallet connected status");
    return !(await this.page.connectButton.isDisplayed());
  }
}
