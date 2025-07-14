import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { Button, Label } from "@shared/web/elements/index";
import { BasePage } from "@shared/web/base/base.page";

export class ProposalViewPage extends BasePage {
  constructor(protected override ef: ElementFinderHelper) {
    super(ef);
  }

  proposalTitleLabel = new Label(this.ef.pw.dataTestId("proposalTitleLabel"));
  proposalStateLabel = new Label(this.ef.pw.dataTestId("proposalStateLabel"));
  votingInfoLoader = new Label(
    this.ef.pw.text("Loading voting information..."),
  );

  approveProposalButton = new Button(
    this.ef.pw.dataTestId("approveProposalButton"),
  );
  abstainProposalButton = new Button(
    this.ef.pw.dataTestId("abstainProposalButton"),
  );
  rejectProposalButton = new Button(
    this.ef.pw.dataTestId("rejectProposalButton"),
  );

  failedToCastVoteNotificationLabel = new Label(
    this.ef.pw.text("Failed to cast vote"),
  );

  staticElements = [this.proposalTitleLabel, this.proposalStateLabel];
}
