import { timeouts } from "@constants/timeouts.constants";
import { ClassLog } from "@decorators/logger.decorators";
import { waiterHelper } from "@helpers/waiter/waiter.helper";
import { NetworkModalPage } from "./network-modal.page";
import { BaseService, IBaseServiceArgs } from "@shared/web/base/base.service";

@ClassLog
export class NetworkModalService extends BaseService {
  public override page: NetworkModalPage = null;

  constructor(args: INetworkModalServiceArgs) {
    const { page } = args;
    super(args);
    this.page = page;
  }

  async switchToNetworkByName(
    name: Network,
    { shouldClosePopup = false }: ISwitchNetworkByName = {},
  ): Promise<void> {
    await this.page.networkButtons[name].click();
    await this.metamask.approveNewNetwork();
    await this.metamask.approveSwitchNetwork();
    shouldClosePopup && (await this.page.closeButton.click());
  }

  async getCurrentNetwork(): Promise<string> {
    return this.page.currentNetworkLabel.getText();
  }

  async waitForNetworkToChange(initialNetwork: string): Promise<boolean> {
    return waiterHelper.wait(
      async () => (await this.getCurrentNetwork()) !== initialNetwork,
      timeouts.s,
      {
        throwError: false,
        errorMessage: `Network didn't change from ${initialNetwork}`,
        interval: timeouts.xxxxs,
      },
    );
  }
}

export interface ISwitchNetworkByName {
  shouldClosePopup?: boolean;
}

export interface INetworkModalServiceArgs extends IBaseServiceArgs {
  page: NetworkModalPage;
}

export enum Network {
  Celo = "Celo",
  Alfajores = "Alfajores",
  Baklava = "Baklava",
}
