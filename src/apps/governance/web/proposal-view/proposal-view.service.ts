import { BaseService, IBaseServiceArgs } from "@shared/web/base/base.service";
import { ClassLog } from "@decorators/logger.decorators";
import { ProposalViewPage } from "./proposal-view.page";
import { timeouts } from "@constants/timeouts.constants";

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

  async getProposalTitle(): Promise<string> {
    return await this.page.proposalTitleLabel.getText();
  }

  async getProposalState(): Promise<string> {
    return await this.page.proposalStateLabel.getText();
  }

  async waitForLoadedVotingInfo(): Promise<boolean> {
    return this.page.votingInfoLoader.waitUntilDisappeared(timeouts.s, {
      errorMessage: "Voting info is not loaded!",
    });
  }
}
