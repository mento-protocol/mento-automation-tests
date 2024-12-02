import { ClassLog } from "@decorators/logger.decorators";
import { NetworkDetailsModalPo } from "@page-objects/index";
import {
  BaseService,
  INetworkDetailsModalService,
  INetworkDetailsModalServiceArgs,
  Network,
} from "@services/index";

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

  async switchNetworkByName(name: Network): Promise<void> {
    return this.page.networkButtons[name].click();
  }

  async getCurrentNetwork(): Promise<string> {
    return this.page.currentNetworkLabel.getText();
  }
}
