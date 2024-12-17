import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { Button, Label } from "@page-elements/index";
import { BasePo, IWalletSettingsPopupPo } from "@page-objects/index";
import { Token } from "@constants/token.constants";

export class WalletSettingsPopupPo
  extends BasePo
  implements IWalletSettingsPopupPo
{
  constructor(protected override ef: ElementFinderHelper) {
    super(ef);
  }

  getTokenBalanceLabelByName(name: Token): Label {
    return new Label(this.ef.dataTestId(`walletSettings_${name}_balance`));
  }

  container = new Label(this.ef.className("py-5 font-medium leading-5"));

  copyAddressButton = new Button(this.ef.pw.text("Copy Address"));
  changeNetworkButton = new Button(this.ef.pw.text("Change Network"));
  disconnectButton = new Button(this.ef.pw.text("Disconnect"));

  staticElements = [this.container, this.copyAddressButton];
}
