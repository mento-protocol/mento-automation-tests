import { isHex, toHex } from "viem";

import { ClassLog } from "@decorators/logger.decorators";
import { envHelper } from "@helpers/env/env.helper";
import { loggerHelper } from "@helpers/logger/logger.helper";
import { magicStrings } from "@constants/magic-strings.constants";
import {
  ICreateProposalParams,
  ICreateProposalResult,
  IProposalData,
} from "./governance.contact.types";
import { BaseContract } from "../base/base.contract";
import { primitiveHelper } from "@helpers/primitive/primitive.helper";
import { ProposalState } from "../../../governance/web/proposal-view/proposal-view.service";

const log = loggerHelper.get("GovernanceHelper");

@ClassLog
export class GovernanceContract extends BaseContract {
  private readonly proposalData =
    magicStrings.governance.generateProposalData();

  constructor() {
    super({
      contractAddress: envHelper.getGovernorAddress(),
      contractAbi: magicStrings.governance.abi as unknown[],
    });
  }

  async createProposal({
    title = this.proposalData.title,
    description = this.proposalData.description,
    executionCode = this.proposalData.executionCode,
    throwError = true,
  }: ICreateProposalParams = {}): Promise<ICreateProposalResult> {
    try {
      const proposal: ICreateProposalParams = {
        title,
        description,
        executionCode,
      };

      const proposalData = this.prepareProposalData(proposal);
      const { txHash, receipt } = await this.callContract({
        functionName: "propose(address[],uint256[],bytes[],string)",
        functionParams: Object.values(proposalData),
      });

      return { txHash, receipt };
    } catch (error) {
      const errorMessage = `Error in 'createProposal' method: ${error}\nError stack: ${error.stack}`;
      log.error(errorMessage);
      if (throwError) throw new Error(errorMessage);
    }
  }

  async getProposalState(proposalId: string): Promise<ProposalState> {
    const { result: stateAsNumber } = await this.callContract({
      functionName: "state(uint256)",
      functionParams: [proposalId],
      shouldReturnResultFirst: true,
    });
    return this.numberToStateMap[stateAsNumber];
  }

  async findProposalByState(
    proposals: IProposal[],
    expectedState: ProposalState,
  ): Promise<IProposal> {
    const states = await Promise.all(
      proposals.map(proposal => this.getProposalState(proposal.proposalId)),
    );
    return proposals.find((_, index) => states[index] === expectedState);
  }

  private numberToStateMap = {
    0: ProposalState.Pending,
    1: ProposalState.Active,
    2: ProposalState.Canceled,
    3: ProposalState.Defeated,
    4: ProposalState.Succeeded,
    5: ProposalState.Queued,
    6: ProposalState.Expired,
    7: ProposalState.Executed,
  };

  private prepareProposalData(proposal: ICreateProposalParams): IProposalData {
    return {
      targets: proposal.executionCode.map(transaction => transaction.address),
      values: proposal.executionCode.map(transaction =>
        typeof transaction.value === "string"
          ? BigInt(transaction.value)
          : BigInt(transaction.value.toString()),
      ),
      calldatas: proposal.executionCode.map(transaction =>
        isHex(transaction.data) ? transaction.data : toHex(transaction.data),
      ),
      description: primitiveHelper.jsonStringify({
        title: proposal.title,
        description: proposal.description,
      }),
    };
  }
}

export interface IProposal {
  __typename: string;
  canceled: boolean;
  description: string;
  endBlock: string;
  executed: boolean;
  proposalCreated: unknown[];
  proposalExecuted: unknown[];
  proposalId: string;
  proposalQueued: unknown[];
  proposer: {
    __typename: string;
    id: string;
  };
  queued: boolean;
  startBlock: string;
  votecast: unknown[];
}
