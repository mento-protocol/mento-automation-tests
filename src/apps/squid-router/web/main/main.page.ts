import { BasePage } from "@shared/web/base/base.page";
import { Button, Label } from "@shared/web/elements/index";
import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";

export class MainSquidRouterPage extends BasePage {
  constructor(protected override ef: ElementFinderHelper) {
    super(ef);
  }
  headerConnectWalletButton = new Button(
    this.ef.role("button", { name: "Sign In", exact: true }),
  );

  connectWalletButton = new Button(
    this.ef.role("button", {
      name: "Connect",
      exact: true,
    }),
  );

  walletSettingsButton = new Button(this.ef.text("0x", { exact: false }));

  networkDetailsButton = new Button(
    this.ef.class(
      "px-2.5 h-7 mt-2 bg-gray-100 dark:bg-neutral-800 rounded-[100px] justify-end items-center gap-1.5 inline-flex",
    ),
  );

  addressCopiedNotificationLabel = new Label(
    this.ef.text("Address copied to clipboard"),
  );

  failedSwitchNetworkNotificationLabel = new Label(
    this.ef.text("Could not switch"),
  );

  staticElements = [this.headerConnectWalletButton];
}
