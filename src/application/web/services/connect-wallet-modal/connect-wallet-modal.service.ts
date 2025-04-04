import {
  IConnectWalletService,
  IConnectWalletServiceArgs,
  WalletName,
  BaseService,
} from "@services/index";
import { ClassLog } from "@decorators/logger.decorators";
import { ConnectWalletModalPo } from "@page-objects/index";
import { timeouts } from "@constants/timeouts.constants";

@ClassLog
export class ConnectWalletModalService
  extends BaseService
  implements IConnectWalletService
{
  public override page: ConnectWalletModalPo = null;

  constructor(args: IConnectWalletServiceArgs) {
    const { page } = args;
    super(args);
    this.page = page;
  }

  async selectWalletByName(name: WalletName): Promise<void> {
    return this.page.walletList[name].click({ timeout: timeouts.xxs });
  }

  async close(): Promise<void> {
    return this.page.closeButton.click({ force: true });
  }
}
