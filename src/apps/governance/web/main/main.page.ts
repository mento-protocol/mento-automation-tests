import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { Button, Label } from "@shared/web/elements/index";
import { BasePage } from "@shared/web/base/base.page";

export class MainGovernancePage extends BasePage {
  constructor(protected override ef: ElementFinderHelper) {
    super(ef);
  }

  headerLabel = new Label(this.ef.pw.text("Mento Governance"));
  headerConnectWalletButton = new Button(
    this.ef.pw.role("button", { name: "Connect Wallet", exact: true }),
  );

  createProposalButton = new Button(this.ef.pw.text("Create New Proposal "));
  votingPowerButton = new Button(this.ef.pw.text("Manage"));

  staticElements = [
    this.headerLabel,
    this.createProposalButton,
    this.votingPowerButton,
  ];
}
