import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { Button, Label } from "@page-elements/index";
import { WalletName } from "@services/index";
import { BasePo, IConnectWalletModalPo } from "@page-objects/index";

export class ConnectWalletModalPo
  extends BasePo
  implements IConnectWalletModalPo
{
  constructor(protected override ef: ElementFinderHelper) {
    super(ef);
  }

  connectWalletModalLabel = new Label(this.ef.id("rk_connect_title"));

  walletList = {
    [WalletName.Metamask]: new Button(
      this.ef.dataTestId("rk-wallet-option-metaMask"),
    ),
  };

  closeButton = new Button(this.ef.pw.label("Close"));

  staticElements = [this.connectWalletModalLabel];
}
