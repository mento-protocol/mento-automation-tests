import { ClassLog } from "@decorators/logger.decorators";
import { NetworkDetailsModalPo } from "@page-objects/index";
import {
  BaseService,
  INetworkDetailsModalService,
  INetworkDetailsModalServiceArgs,
  Network,
} from "@services/index";

export interface ISwitchNetworkByName {
  shouldClosePopup?: boolean;
}

@ClassLog
export class NetworkDetailsModalService
  extends BaseService
  implements INetworkDetailsModalService
{
  public override page: NetworkDetailsModalPo = null;

  constructor(args: INetworkDetailsModalServiceArgs) {
    const { page } = args;
    super(args);
    this.page = page;
  }

  async switchNetworkByName(
    name: Network,
    { shouldClosePopup = false }: ISwitchNetworkByName = {},
  ): Promise<void> {
    await this.page.networkButtons[name].click();
    await this.metamaskHelper.approveNewNetwork();
    await this.metamaskHelper.approveSwitchNetwork();
    shouldClosePopup && (await this.page.closeButton.click());
  }

  async getCurrentNetwork(): Promise<string> {
    return this.page.currentNetworkLabel.getText();
  }
}
