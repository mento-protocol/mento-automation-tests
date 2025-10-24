import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { BasePage } from "@shared/web/base/base.page";
import { Button } from "@shared/web/elements/index";
import { WalletName } from "./squid-connect-wallet-modal.service";

export class SquidConnectWalletModalPage extends BasePage {
  constructor(protected override ef: ElementFinderHelper) {
    super(ef);
  }

  walletList = {
    [WalletName.Metamask]: new Button(this.ef.text("MetaMask")),
  };

  cancelButton = new Button(this.ef.text("Cancel"));

  staticElements = [this.cancelButton];
}
