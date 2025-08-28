import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { Token } from "@constants/token.constants";
import { BasePage } from "@shared/web/base/base.page";
import { Button, Label } from "@shared/web/elements/index";

export class WalletSettingsPopupPage extends BasePage {
  constructor(protected override ef: ElementFinderHelper) {
    super(ef);
  }

  getTokenBalanceLabelByName(name: Token): Label {
    return new Label(this.ef.dataTestId(`walletSettings_${name}_balance`));
  }

  copyAddressButton = new Button(this.ef.text("Copy Address"));
  changeNetworkButton = new Button(this.ef.text("Change Network"));
  disconnectButton = new Button(this.ef.text("Disconnect"));

  staticElements = [this.copyAddressButton];
}
