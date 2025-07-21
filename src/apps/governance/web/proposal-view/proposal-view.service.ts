import { BaseService, IBaseServiceArgs } from "@shared/web/base/base.service";
import { ClassLog } from "@decorators/logger.decorators";
import { ProposalViewPage } from "./proposal-view.page";
import { timeouts } from "@constants/timeouts.constants";
import { expect } from "@fixtures/test.fixture";
import { primitiveHelper } from "@helpers/primitive/primitive.helper";
import { waiterHelper } from "@helpers/waiter/waiter.helper";

@ClassLog
export class ProposalViewService extends BaseService {
  public override page: ProposalViewPage = null;

  constructor(args: IProposalViewServiceArgs) {
    const { page } = args;
    super(args);
    this.page = page;
  }

  async vote(
    vote: Vote,
    { shouldConfirmTx = true }: { shouldConfirmTx?: boolean } = {},
  ): Promise<void> {
    await this.page.voteButtons[vote].click();
    await this.page.waitingForConfirmationLabel.waitUntilDisplayed(timeouts.s, {
      errorMessage: "'Waiting for confirmation label' is not displayed!",
    });
    await this.page.waitingForConfirmationDescriptionLabel.waitUntilDisplayed(
      timeouts.s,
      {
        errorMessage:
          "'Waiting for confirmation description' is not displayed!",
      },
    );
    expect
      .soft(await this.page.waitingForConfirmationDescriptionLabel.getText())
      .toBe(
        `You are voting to ${primitiveHelper.string.capitalize(
          vote,
        )} on this proposal`,
      );
    shouldConfirmTx
      ? await this.metamask.confirmTransaction()
      : await this.metamask.rejectTransaction();
  }

  async getReachedQuorum(): Promise<number> {
    await this.page.quorumReachedLabel.waitUntilDisplayed(timeouts.s, {
      errorMessage: "Reached quorum label is not displayed!",
    });
    const rawQuorumText = await this.page.quorumReachedLabel.getText();
    const currentQuorum = rawQuorumText.split(" ")[0];
    const currentQuorumAsNumber =
      primitiveHelper.number.convertAbbreviatedToNumber(currentQuorum);
    return currentQuorumAsNumber;
  }

  async getUsedVoteOption(): Promise<Vote> {
    await this.page.usedVoteOptionButton.waitUntilDisplayed(timeouts.s, {
      errorMessage: "Used vote option button is not displayed!",
    });
    const vote = await this.page.usedVoteOptionButton.getText();
    return vote.replace("Your vote: ", "").toLowerCase() as Vote;
  }

  async getProposalTitle(): Promise<string> {
    return await this.page.proposalTitleLabel.getText();
  }

  async getProposalDescription(): Promise<string> {
    return await this.page.proposalDescriptionLabel.getText();
  }

  async getProposalState(): Promise<string> {
    return await this.page.proposalStateLabel.getText();
  }

  async waitForLoadedVotingInfo(): Promise<boolean> {
    return this.page.votingInfoLoader.waitUntilDisappeared(timeouts.s, {
      errorMessage: "Voting info is not loaded!",
    });
  }

  async waitForReachedQuorumToChange(initialQuorum: number): Promise<boolean> {
    return waiterHelper.wait(
      async () => this.isReachedQuorumChanged(initialQuorum),
      timeouts.s,
      {
        errorMessage: "Reached quorum is not changed!",
        throwError: false,
      },
    );
  }

  async waitForParticipantAddress(
    address: string,
    timeout = timeouts.m,
  ): Promise<boolean> {
    return this.page
      .getParticipantAddress(address)
      .waitUntilDisplayed(timeout, {
        errorMessage: "Participant address is not displayed!",
        throwError: false,
      });
  }

  async isReachedQuorumChanged(initialQuorum: number): Promise<boolean> {
    const currentQuorum = await this.getReachedQuorum();
    return currentQuorum !== initialQuorum;
  }

  async isVoteCastSuccessfully(timeout = timeouts.m): Promise<boolean> {
    return this.page.voteCastSuccessfullyNotificationLabel.waitUntilDisplayed(
      timeout,
      {
        errorMessage: "Vote cast successfully notification is not displayed!",
        throwError: false,
      },
    );
  }

  async isVoteCastFailed(timeout = timeouts.s): Promise<boolean> {
    return this.page.voteCastFailedNotificationLabel.waitUntilDisplayed(
      timeout,
      {
        errorMessage: "Vote cast failed notification is not displayed!",
      },
    );
  }

  async expectProposalSuccessfully({
    title,
    description,
    state = ProposalState.Active,
  }: {
    title: string;
    description: string;
    state: ProposalState;
  }): Promise<void> {
    expect.soft(await this.getProposalTitle()).toBe(title);
    expect.soft(await this.getProposalDescription()).toBe(description);
    await this.waitForLoadedVotingInfo();
    expect.soft(await this.getProposalState()).toBe(state);
    for (const voteButton of Object.values(this.page.voteButtons)) {
      expect.soft(await voteButton.isDisplayed()).toBeTruthy();
    }
  }

  async expectVote({
    initialReachedQuorum,
    vote,
  }: {
    initialReachedQuorum: number;
    vote: Vote;
  }): Promise<void> {
    const address = await this.metamask.getAddress();
    expect.soft(await this.isVoteCastSuccessfully()).toBeTruthy();
    await this.waitForReachedQuorumToChange(initialReachedQuorum);
    expect
      .soft(await this.getReachedQuorum())
      .toBeGreaterThan(initialReachedQuorum);
    expect.soft(await this.getUsedVoteOption()).toBe(vote);
    if (vote !== Vote.Approve) await this.page.participantsTabs[vote].click();
    expect(await this.waitForParticipantAddress(address)).toBeTruthy();
  }
}

export enum Vote {
  Approve = "approve",
  Reject = "reject",
  Abstain = "abstain",
}

export enum ProposalState {
  Active = "active",
  Canceled = "canceled",
  Defeated = "defeated",
  Executed = "executed",
  Expired = "expired",
  NoState = "nostate",
  Pending = "pending",
  Queued = "queued",
  Succeeded = "succeeded",
}

export interface IProposalViewServiceArgs extends IBaseServiceArgs {
  page: ProposalViewPage;
}
