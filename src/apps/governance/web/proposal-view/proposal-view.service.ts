import { BaseService, IBaseServiceArgs } from "@shared/web/base/base.service";
import { ClassLog } from "@decorators/logger.decorators";
import { ProposalViewPage } from "./proposal-view.page";
import { timeouts } from "@constants/timeouts.constants";
import { expect } from "@fixtures/test.fixture";

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

@ClassLog
export class ProposalViewService extends BaseService {
  public override page: ProposalViewPage = null;

  constructor(args: IProposalViewServiceArgs) {
    const { page } = args;
    super(args);
    this.page = page;
  }

  async approveProposal(): Promise<void> {
    await this.page.approveProposalButton.click();
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
      .toBe("You are voting to Approve on this proposal");
    await this.metamask.confirmTransaction();
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

  async isVoteCastSuccessfully(timeout = timeouts.s): Promise<boolean> {
    return this.page.voteCastSuccessfullyNotificationLabel.waitUntilDisplayed(
      timeout,
      {
        errorMessage: "Vote cast successfully notification is not displayed!",
        throwError: false,
      },
    );
  }

  async isParticipantAddressDisplayed(
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

  async expectProposal({
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
    expect(await this.getProposalState()).toBe(state);
  }
}
