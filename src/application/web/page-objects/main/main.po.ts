import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { Button, Label } from "@page-elements/index";
import { BasePo } from "@page-objects/index";

export class MainPo extends BasePo {
  constructor(protected override ef: ElementFinderHelper) {
    super(ef);
  }

  headerConnectWalletButton = new Button(
    this.ef.pw.role("button", { name: "Connect", exact: true }),
  );

  connectWalletButton = new Button(
    this.ef.pw.role("button", { name: "Connect Wallet", exact: true }),
  );

  walletSettingsButton = new Button(this.ef.pw.text("0x", { exact: false }));

  addressCopiedNotificationLabel = new Label(
    this.ef.pw.text("Address copied to clipboard"),
  );

  failedSwitchNetworkNotificationLabel = new Label(
    this.ef.pw.text("Could not switch"),
  );

  staticElements = [this.headerConnectWalletButton];
}
