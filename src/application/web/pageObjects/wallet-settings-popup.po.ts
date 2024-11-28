import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { BasePo } from "@pageObjects/base.po";
import { Button } from "@pageElements/button";
import { Label } from "@pageElements/label";

interface IWalletSettingsPopupPo {
  copyAddressButton: Button;
  changeNetworkButton: Button;
  disconnectButton: Button;
}

export class WalletSettingsPopupPo
  extends BasePo
  implements IWalletSettingsPopupPo
{
  constructor(protected override ef: ElementFinderHelper) {
    super(ef);
  }

  container = new Label(this.ef.className("py-5 font-medium leading-5"));

  copyAddressButton = new Button(this.ef.pw.text("Copy Address"));
  changeNetworkButton = new Button(this.ef.pw.text("Change Network"));
  disconnectButton = new Button(this.ef.pw.text("Disconnect"));

  staticElements = [this.container, this.copyAddressButton];
}
