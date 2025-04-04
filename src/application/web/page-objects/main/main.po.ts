import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { Button, Label } from "@page-elements/index";
import { BasePo, IMainPo } from "@page-objects/index";

export class MainPo extends BasePo implements IMainPo {
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

  networkDetailsButton = new Button(
    this.ef.className(
      "px-2.5 h-7 mt-2 bg-gray-100 dark:bg-neutral-800 rounded-[100px] justify-end items-center gap-1.5 inline-flex",
    ),
  );

  addressCopiedNotificationLabel = new Label(
    this.ef.pw.text("Address copied to clipboard"),
  );

  failedSwitchNetworkNotificationLabel = new Label(
    this.ef.pw.text("Could not switch"),
  );

  staticElements = [this.headerConnectWalletButton];
}
