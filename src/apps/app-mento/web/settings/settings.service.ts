import { ClassLog } from "@decorators/logger.decorators";
import { SettingsPage } from "./settings.page";
import { BaseService, IBaseServiceArgs } from "@shared/web/base/base.service";
import { Network, SwitchNetworksPage } from "./switch-networks.page";
import { timeouts } from "@constants/index";
import { waiterHelper } from "@helpers/waiter/waiter.helper";

@ClassLog
export class SettingsService extends BaseService {
  public override page: SettingsPage = null;
  public switchNetworksPage: SwitchNetworksPage = null;

  constructor(args: ISettingsServiceArgs) {
    const { page, switchNetworksPage } = args;
    super(args);
    this.page = page;
    this.switchNetworksPage = switchNetworksPage;
  }

  async disconnect(): Promise<void> {
    return this.page.disconnectButton.click();
  }

  async copyAddress(): Promise<void> {
    return this.page.copyAddressButton.click();
  }

  async openNetworkDetails(): Promise<void> {
    return this.page.changeNetworkButton.click();
  }

  async switchNetwork(networkName: Network): Promise<void> {
    await this.switchNetworksPage.networkButtons[networkName].click();
    await waiterHelper.sleep(timeouts.xxs, {
      sleepReason: "In case of previous metamask popup hasn't closed yet",
    });
    await this.metamask.approveNewNetwork();
    await this.metamask.approveSwitchNetwork();
  }

  async rejectSwitchNetwork(networkName: Network): Promise<void> {
    await this.switchNetworksPage.networkButtons[networkName].click();
    await waiterHelper.sleep(timeouts.xxs, {
      sleepReason: "In case of previous metamask popup hasn't closed yet",
    });
    await this.metamask.approveNewNetwork();
    await this.metamask.rejectSwitchNetwork();
  }

  async getCurrentNetwork(): Promise<Network> {
    return (await this.switchNetworksPage.networkButtons[
      Network.Celo
    ].isDisabled())
      ? Network.Celo
      : Network.Alfajores;
  }
}

interface ISettingsServiceArgs extends IBaseServiceArgs {
  page: SettingsPage;
  switchNetworksPage: SwitchNetworksPage;
}
