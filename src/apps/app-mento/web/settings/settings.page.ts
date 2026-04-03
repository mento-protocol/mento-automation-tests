import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { Token } from "@constants/token.constants";
import { BasePage } from "@shared/web/base/base.page";
import { Button, Label } from "@shared/web/elements/index";

export class SettingsPage extends BasePage {
  constructor(protected override ef: ElementFinderHelper) {
    super(ef);
  }

  getTokenBalanceLabelByName(name: Token): Label {
    return new Label(this.ef.dataTestId(`walletSettings_${name}_balance`));
  }

  copyAddressButton = new Button(this.ef.text("Copy Address"));
  disconnectButton = new Button(this.ef.text("Disconnect"));
  testnetModeCheckbox = new Button(this.ef.text("Testnet Mode"));

  staticElements = [this.copyAddressButton, this.disconnectButton];
}
