import { BaseService } from "@services/base.service";
import { loggerHelper } from "@helpers/logger/logger.helper";
import { ClassLog } from "@decorators/logger.decorators";
import { IBaseServiceArgs } from "@services/types/base.service.types";
import { NetworkDetailsModalPo } from "@pageObjects/network-details-modal.po";

const logger = loggerHelper.get("NetworkDetailsModalService");

// todo: FILL
export interface INetworkDetailsModalService {
  switchNetworkByName: (name: Network) => Promise<void>;
  getCurrentNetwork: () => Promise<string>;
}

export interface INetworkDetailsModalServiceArgs extends IBaseServiceArgs {
  page: NetworkDetailsModalPo;
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

  async switchNetworkByName(name: Network): Promise<void> {
    return this.page.networkButtons[name].click();
  }

  async getCurrentNetwork(): Promise<string> {
    return this.page.currentNetworkLabel.getText();
  }
}

// todo: MOVE TO TYPES FILE
export enum Network {
  Celo = "Celo",
  Alfajores = "Alfajores",
  Baklava = "Baklava",
}
