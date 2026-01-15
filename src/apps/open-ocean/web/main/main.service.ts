import { BaseService, IBaseServiceArgs } from "@shared/web/base/base.service";
import { ClassLog } from "@decorators/logger.decorators";
import { waiterHelper } from "@helpers/waiter/waiter.helper";
import { MainOpenOceanPage } from "./main.page";
import { WalletName } from "@shared/web/connect-wallet-modal/connect-wallet-modal.service";
import { OpenOceanWalletModalService } from "../open-ocean-wallet-modal/open-ocean-wallet-modal.service";

@ClassLog
export class MainOpenOceanService extends BaseService {
  public override page: MainOpenOceanPage = null;
  public connectWalletModal: OpenOceanWalletModalService = null;

  private readonly swapPageRelativeUrl = "swap/celo";

  constructor(args: IMainOpenOceanServiceArgs) {
    const { page, connectWalletModal } = args;
    super(args);
    this.page = page;
    this.connectWalletModal = connectWalletModal;
  }

  async navigateToSwapPage(): Promise<void> {
    await this.navigateToAppPage(this.swapPageRelativeUrl);
  }

  async openConnectWalletModal(): Promise<void> {
    await this.page.connectWalletButton.click();
    await this.connectWalletModal.page.verifyIsOpen();
  }

  async connectWalletByName(walletName: WalletName): Promise<void> {
    await waiterHelper.retry(
      async () => {
        await this.openConnectWalletModal();
        await this.connectWalletModal.selectWalletByName(walletName);
        await this.metamask.connectWallet();
        (await this.page.closeGuideButton.isDisplayed()) &&
          (await this.page.closeGuideButton.click());
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
    return !(await this.page.connectWalletButton.isDisplayed());
  }
}

export interface IMainOpenOceanServiceArgs extends IBaseServiceArgs {
  page: MainOpenOceanPage;
  connectWalletModal: OpenOceanWalletModalService;
}
