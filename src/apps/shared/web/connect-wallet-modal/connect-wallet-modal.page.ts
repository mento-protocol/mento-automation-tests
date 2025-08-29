import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { BasePage } from "@shared/web/base/base.page";
import { Button, Label } from "../elements/index";
import { WalletName } from "./connect-wallet-modal.service";

export class ConnectWalletModalPage extends BasePage {
  constructor(protected override ef: ElementFinderHelper) {
    super(ef);
  }

  connectWalletModalLabel = new Label(this.ef.id("rk_connect_title"));

  walletList = {
    [WalletName.Metamask]: new Button(this.ef.text("MetaMask")),
  };

  closeButton = new Button(this.ef.label("Close"));

  staticElements = [this.connectWalletModalLabel];
}
