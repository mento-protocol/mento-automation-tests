import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { Button, Label } from "@shared/web/elements/index";
import { BasePage } from "@shared/web/base/base.page";
import { web3Helper } from "@helpers/web3/web3.helper";

export class ProposalViewPage extends BasePage {
  constructor(protected override ef: ElementFinderHelper) {
    super(ef);
  }

  getParticipantAddress(address: string) {
    return new Label(
      this.ef.pw.role("button", {
        name: `${web3Helper.truncateAddress(address)}`,
        exact: true,
      }),
    );
  }

  proposalTitleLabel = new Label(this.ef.pw.dataTestId("proposalTitleLabel"));
  proposalDescriptionLabel = new Label(
    this.ef.pw.dataTestId("proposalDescriptionLabel"),
  );
  proposalStateLabel = new Label(this.ef.pw.dataTestId("proposalStateLabel"));
  votingInfoLoader = new Label(
    this.ef.pw.text("Loading voting information..."),
  );

  quorumReachedLabel = new Button(this.ef.pw.dataTestId("quorumReachedLabel"));

  voteButtons = {
    approve: new Button(this.ef.pw.dataTestId("approveProposalButton")),
    abstain: new Button(this.ef.pw.dataTestId("abstainProposalButton")),
    reject: new Button(this.ef.pw.dataTestId("rejectProposalButton")),
  };

  usedVoteOptionButton = new Button(
    this.ef.pw.dataTestId("usedVoteOptionButton"),
  );

  participantsTabs = {
    approve: new Button(this.ef.pw.dataTestId("participantsTabButton_approve")),
    abstain: new Button(this.ef.pw.dataTestId("participantsTabButton_abstain")),
    reject: new Button(this.ef.pw.dataTestId("participantsTabButton_reject")),
  };

  waitingForConfirmationLabel = new Label(
    this.ef.pw.dataTestId("waitingForConfirmationLabel"),
  );
  waitingForConfirmationDescriptionLabel = new Label(
    this.ef.pw.dataTestId("waitingForConfirmationDescriptionLabel"),
  );

  voteCastSuccessfullyNotificationLabel = new Label(
    this.ef.pw.text("Vote cast successfully!"),
  );
  voteCastFailedNotificationLabel = new Label(
    this.ef.pw.text("Failed to cast vote"),
  );

  staticElements = [this.proposalTitleLabel, this.proposalStateLabel];
}
