import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { MainPoInterface } from "@pageObjects/types/main.po.types";
import { Button } from "@pageElements/button";
import { BasePo } from "@pageObjects/base.po";

export class MainPo extends BasePo implements MainPoInterface {
  constructor(protected override ef: ElementFinderHelper) {
    super(ef);
  }

  headerConnectWalletButton = new Button(
    this.ef.pw.role("button", { name: "Connect", exact: true }),
  );

  connectWalletButton = new Button(
    this.ef.pw.role("button", { name: "Connect Wallet", exact: true }),
  );

  staticElements = [this.headerConnectWalletButton];
}
