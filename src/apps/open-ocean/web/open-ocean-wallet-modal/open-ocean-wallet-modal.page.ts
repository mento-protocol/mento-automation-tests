import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { BasePage } from "@shared/web/base/base.page";
import { Button } from "@shared/web/elements/index";
import { WalletName } from "./open-ocean-wallet-modal.service";

export class OpenOceanWalletModalPage extends BasePage {
  constructor(protected override ef: ElementFinderHelper) {
    super(ef);
  }

  walletList = {
    [WalletName.Metamask]: new Button(this.ef.text("MetaMask")),
  };

  cancelButton = new Button(this.ef.class("iconfont iconClose icon_close"));

  staticElements = [this.cancelButton];
}
