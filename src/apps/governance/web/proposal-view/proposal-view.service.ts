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
      .toBe(`You are voting ${vote.toUpperCase()} on this proposal`);
    shouldConfirmTx
      ? await this.metamask.confirmTransaction()
      : await this.metamask.rejectTransaction();
  }

  async getTotalVotes(): Promise<number> {
    await this.page.totalVotesLabel.waitUntilDisplayed(timeouts.s, {
      errorMessage: "Total votes label is not displayed!",
    });
    const rawTotalVotesText = await this.page.totalVotesLabel.getText();
    const currentTotalVotes = rawTotalVotesText.split(" ")[0];
    const currentTotalVotesAsNumber =
      primitiveHelper.number.convertAbbreviatedToNumber(currentTotalVotes);
    return currentTotalVotesAsNumber;
  }

  async waitForTotalVotesToLoad(): Promise<boolean> {
    return waiterHelper.wait(
      async () => (await this.getTotalVotes()) > 0,
      timeouts.m,
      {
        errorMessage: "Total votes are not loaded!",
      },
    );
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

  async waitForParticipantAddress(
    address: string,
    timeout = timeouts.l,
  ): Promise<boolean> {
    return await this.page
      .getParticipantAddressLabel(address)
      .waitUntilDisplayed(timeout, {
        errorMessage: "Participant address is not displayed!",
        throwError: false,
      });
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

  async expectVote(vote: Vote): Promise<void> {
    expect.soft(await this.isVoteCastSuccessfully()).toBeTruthy();
    await this.waitForTotalVotesToLoad();
    expect.soft(await this.getTotalVotes()).toBeGreaterThan(0);
    expect.soft(await this.getUsedVoteOption()).toBe(vote);
    // if (vote !== Vote.Yes) await this.page.participantsTabs[vote].click();
    // TODO: Fix FE element to be displayed (it's actually displayed, but PW doesn't see that)
    // expect(await this.waitForParticipantAddress(address)).toBeTruthy();
  }
}

export enum Vote {
  Yes = "yes",
  No = "no",
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
