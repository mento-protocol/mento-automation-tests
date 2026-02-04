import { BaseService, IBaseServiceArgs } from "@shared/web/base/base.service";
import { ClassLog } from "@decorators/logger.decorators";
import { waiterHelper } from "@helpers/waiter/waiter.helper";
import { MainSquidRouterPage } from "./main.page";
import { WalletName } from "@shared/web/connect-wallet-modal/connect-wallet-modal.service";
import { SquidConnectWalletModalService } from "../squid-connect-wallet-modal/squid-connect-wallet-modal.service";
import { timeouts } from "@constants/index";

@ClassLog
export class MainSquidRouterService extends BaseService {
  public override page: MainSquidRouterPage = null;
  public connectWalletModal: SquidConnectWalletModalService = null;

  constructor(args: IMainSquidRouterServiceArgs) {
    const { page, connectWalletModal } = args;
    super(args);
    this.page = page;
    this.connectWalletModal = connectWalletModal;
  }

  async openConnectWalletModal(): Promise<void> {
    await this.page.connectWalletButton.click();
    await this.connectWalletModal.page.verifyIsOpen();
  }

  async openConnectWalletModalFromHeader(): Promise<void> {
    await this.page.headerConnectWalletButton.click();
    await this.connectWalletModal.page.verifyIsOpen();
  }

  async connectWalletByName(walletName: WalletName): Promise<void> {
    await this.page.connectWalletButton.waitForDisplayed(timeouts.s);
    await waiterHelper.retry(
      async () => {
        await this.openConnectWalletModal();
        await this.connectWalletModal.selectWalletByName(walletName);
        await this.metamask.connectWallet();
        return this.isWalletConnected();
      },
      3,
      {
        errorMessage: "Failed to connect wallet",
        throwError: false,
        resolveWhenNoException: true,
      },
    );
  }

  async isWalletConnected(): Promise<boolean> {
    return !(await this.page.headerConnectWalletButton.isDisplayed());
  }
}

export interface IMainSquidRouterServiceArgs extends IBaseServiceArgs {
  page: MainSquidRouterPage;
  connectWalletModal: SquidConnectWalletModalService;
}
