import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { Button, Label } from "@shared/web/elements/index";
import { BasePage } from "@shared/web/base/base.page";
import { web3Helper } from "@helpers/web3/web3.helper";

export class ProposalViewPage extends BasePage {
  constructor(protected override ef: ElementFinderHelper) {
    super(ef);
  }

  getParticipantAddressLabel(address: string) {
    const truncatedAddress = web3Helper.truncateAddress(address);
    return new Label(this.ef.role("button", { name: truncatedAddress }));
  }

  proposalTitleLabel = new Label(this.ef.dataTestId("proposalTitleLabel"));
  proposalDescriptionLabel = new Label(
    this.ef.dataTestId("proposalDescriptionLabel"),
  );
  proposalStateLabel = new Label(this.ef.dataTestId("proposalStateLabel"));
  votingInfoLoader = new Label(this.ef.text("Loading voting information..."));

  quorumReachedLabel = new Button(this.ef.dataTestId("quorumReachedLabel"));
  totalVotesLabel = new Label(this.ef.dataTestId("totalVotesLabel"));

  voteButtons = {
    yes: new Button(this.ef.dataTestId("yesProposalButton")),
    abstain: new Button(this.ef.dataTestId("abstainProposalButton")),
    no: new Button(this.ef.dataTestId("noProposalButton")),
  };

  usedVoteOptionButton = new Button(this.ef.dataTestId("usedVoteOptionButton"));

  participantsTabs = {
    approve: new Button(this.ef.dataTestId("participantsTabButton_approve")),
    abstain: new Button(this.ef.dataTestId("participantsTabButton_abstain")),
    reject: new Button(this.ef.dataTestId("participantsTabButton_reject")),
  };

  waitingForConfirmationLabel = new Label(
    this.ef.dataTestId("waitingForConfirmationLabel"),
  );
  waitingForConfirmationDescriptionLabel = new Label(
    this.ef.dataTestId("waitingForConfirmationDescriptionLabel"),
  );

  voteCastSuccessfullyNotificationLabel = new Label(
    this.ef.text("Vote cast successfully!"),
  );
  voteCastFailedNotificationLabel = new Label(
    this.ef.text("Failed to cast vote"),
  );

  staticElements = [this.proposalTitleLabel, this.proposalStateLabel];
}
