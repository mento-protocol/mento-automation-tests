import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { Button, ElementsList, Label } from "@shared/web/elements/index";
import { BasePage } from "@shared/web/base/base.page";

export class MainGovernancePage extends BasePage {
  constructor(protected override ef: ElementFinderHelper) {
    super(ef);
  }

  headerLabel = new Label(this.ef.text("Mento Governance"));
  headerConnectWalletButton = new Button(
    this.ef.role("button", { name: "Connect Wallet", exact: true }),
  );
  navButtons = {
    home: new Button(this.ef.text("Home")),
    createProposal: new Button(this.ef.text("Create Proposal")),
    votingPower: new Button(this.ef.text("My Voting Power")),
  };

  createProposalButton = new Button(this.ef.text("Create New Proposal "));
  votingPowerButton = new Button(this.ef.text("My Voting Power"));

  contractAddressesSection = new Button(
    this.ef.dataTestId("contract-addresses-accordion-button"),
  );
  contractAddresseLinkButtons = {
    governor: new Button(this.ef.dataTestId("governor-address-button")),
    mento: new Button(this.ef.dataTestId("mento-address-button")),
    timelock: new Button(this.ef.dataTestId("timelock-address-button")),
    veMento: new Button(this.ef.dataTestId("veMento-address-button")),
  };
  headerAndFooterLinkButtons = {
    forum: new Button(this.ef.text("Governance Forum")),
    x: new Button(this.ef.dataTestId("x-link-button")),
    github: new Button(this.ef.dataTestId("github-link-button")),
    discord: new Button(this.ef.dataTestId("discord-link-button")),
    mentoOrg: new Button(this.ef.text("Mento.org")),
    reserve: new Button(this.ef.text("Reserve", { exact: true })),
    privacyPolicy: new Button(this.ef.text("Privacy Policy")),
  };

  allProposals = new ElementsList(Button, this.ef.dataTestId("proposal_"));

  async getProposalByTitle(title: string): Promise<Button> {
    return new Button(this.ef.dataTestId(`proposal_${title}`));
  }

  staticElements = [
    this.headerLabel,
    this.createProposalButton,
    this.votingPowerButton,
  ];
}
