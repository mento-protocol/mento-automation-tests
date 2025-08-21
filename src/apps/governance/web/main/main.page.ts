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

  contractAddressesSection = new Button(
    this.ef.pw.dataTestId("contract-addresses-accordion-button"),
  );
  contractAddresseLinkButtons = {
    governor: new Button(this.ef.pw.dataTestId("governor-address-button")),
    mento: new Button(this.ef.pw.dataTestId("mento-address-button")),
    timelock: new Button(this.ef.pw.dataTestId("timelock-address-button")),
    veMento: new Button(this.ef.pw.dataTestId("veMento-address-button")),
  };
  headerAndFooterLinkButtons = {
    forum: new Button(this.ef.pw.text("Governance Forum")),
    x: new Button(this.ef.pw.dataTestId("x-link-button")),
    github: new Button(this.ef.pw.dataTestId("github-link-button")),
    discord: new Button(this.ef.pw.dataTestId("discord-link-button")),
    mentoOrg: new Button(this.ef.pw.text("Mento.org")),
    reserve: new Button(this.ef.pw.text("Reserve", { exact: true })),
    privacyPolicy: new Button(this.ef.pw.text("Privacy Policy")),
  };

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
