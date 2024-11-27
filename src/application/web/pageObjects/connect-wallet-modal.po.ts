import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { BasePo } from "@pageObjects/base.po";
import { Label } from "@pageElements/label";
import { WalletName } from "@services/connect-wallet-modal.service";
import { Button } from "@pageElements/button";

// todo: FILL
interface IConnectWalletModalPo {}

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

  closeButton = new Button(
    this.ef.className(
      "iekbcc0 iekbcc9 ju367v4 ju367v9u ju367vc0 ju367vs ju367vt ju367vv ju367vf9 ju367va ju367v26 ju367v2l ju367v8o ju367v8y _12cbo8i3 ju367v8m _12cbo8i5 _12cbo8i7",
    ),
  );

  staticElements = [this.connectWalletModalLabel];
}
