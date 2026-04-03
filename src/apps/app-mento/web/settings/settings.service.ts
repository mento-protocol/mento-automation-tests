import { ClassLog } from "@decorators/logger.decorators";
import { SettingsPage } from "./settings.page";
import { BaseService, IBaseServiceArgs } from "@shared/web/base/base.service";

@ClassLog
export class SettingsService extends BaseService {
  public override page: SettingsPage = null;

  constructor(args: ISettingsServiceArgs) {
    const { page } = args;
    super(args);
    this.page = page;
  }

  async disconnect(): Promise<void> {
    return this.page.disconnectButton.click();
  }

  async copyAddress(): Promise<void> {
    return this.page.copyAddressButton.click();
  }
}

interface ISettingsServiceArgs extends IBaseServiceArgs {
  page: SettingsPage;
}
