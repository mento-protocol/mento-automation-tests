import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { Button } from "@shared/web/elements/index";
import { BasePage } from "@shared/web/base/base.page";

export class MainGovernancePage extends BasePage {
  constructor(protected override ef: ElementFinderHelper) {
    super(ef);
  }

  headerConnectWalletButton = new Button(
    this.ef.pw.role("button", { name: "Connect wallet", exact: true }),
  );

  staticElements = [this.headerConnectWalletButton];
}
