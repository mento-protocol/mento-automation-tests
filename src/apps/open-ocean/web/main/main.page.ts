import { BasePage } from "@shared/web/base/base.page";
import { Button } from "@shared/web/elements/index";
import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";

export class MainOpenOceanPage extends BasePage {
  constructor(protected override ef: ElementFinderHelper) {
    super(ef);
  }
  connectWalletButton = new Button(
    this.ef.text("Connect Wallet", { exact: false }).first(),
  );

  closeGuideButton = new Button(this.ef.class("driver-popover-close-btn"));

  staticElements = [this.connectWalletButton];
}
