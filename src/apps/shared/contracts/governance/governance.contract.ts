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

const log = loggerHelper.get("GovernanceHelper");

@ClassLog
export class GovernanceContract extends BaseContract {
  private readonly proposalData =
    magicStrings.governance.generateProposalData();

  constructor() {
    super({
      contractAddress: envHelper.getGovernorAddress(),
      contractAbi: magicStrings.governance.abi,
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
        functionName: "propose",
        functionParams: Object.values(proposalData),
      });

      return { txHash, receipt };
    } catch (error) {
      const errorMessage = `Error in 'createProposal' method: ${error}\nError stack: ${error.stack}`;
      log.error(errorMessage);
      if (throwError) throw new Error(errorMessage);
    }
  }

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
