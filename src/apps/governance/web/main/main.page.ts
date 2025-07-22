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
  navButtons = {
    home: new Button(this.ef.pw.text("Home")),
    createProposal: new Button(this.ef.pw.text("Create Proposal")),
    votingPower: new Button(this.ef.pw.text("My Voting Power")),
  };

  createProposalButton = new Button(this.ef.pw.text("Create New Proposal "));
  votingPowerButton = new Button(this.ef.pw.text("My Voting Power"));

  async getProposalByTitle(title: string): Promise<Button> {
    return new Button(this.ef.pw.dataTestId(`proposal_${title}`));
  }

  // async getAllProposals(): Promise<string[]> {
  //   const allProposals = await this.ef.all.dataTestId("proposal_").findElements();
  //   return Promise.all(allTokens.map(token => ));
  // }

  staticElements = [
    this.headerLabel,
    this.createProposalButton,
    this.votingPowerButton,
  ];
}
