import {
  Address,
  encodeAbiParameters,
  hexToBigInt,
  isHex,
  keccak256,
  parseAbiParameters,
  stringToBytes,
  toHex,
} from "viem";

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

const log = loggerHelper.get("GovernanceHelper");

@ClassLog
export class GovernanceContract extends BaseContract {
  private readonly proposalData = magicStrings.governance.proposalData;

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
  }: ICreateProposalParams): Promise<ICreateProposalResult> {
    try {
      const proposal: ICreateProposalParams = {
        title,
        description,
        executionCode,
      };

      const proposalId = this.createProposalId(proposal);
      const proposalData = this.prepareProposalData(proposal);
      const txHash = await this.callContract({
        functionName: "propose",
        functionParams: Object.values(proposalData),
      });

      return {
        proposalId,
        txHash,
      };
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
      description: JSON.stringify(
        {
          title: proposal.title,
          description: proposal.description,
        },
        (_, value) => {
          if (typeof value === "bigint") return value?.toString() || "";
          return value || "";
        },
      ),
    };
  }

  private createProposalId(proposal: ICreateProposalParams): string {
    return hexToBigInt(
      keccak256(
        encodeAbiParameters(
          parseAbiParameters(
            "address[] targets, uint256[] values, bytes[] calldatas, bytes32 descriptionHash",
          ),
          [
            proposal.executionCode.map(
              transaction => transaction.address as Address,
            ),
            proposal.executionCode.map(transaction =>
              typeof transaction.value === "string"
                ? BigInt(transaction.value)
                : BigInt(transaction.value.toString()),
            ),
            proposal.executionCode.map(transaction =>
              isHex(transaction.data)
                ? transaction.data
                : toHex(transaction.data),
            ),
            keccak256(
              stringToBytes(
                JSON.stringify(
                  {
                    title: proposal.title,
                    description: proposal.description,
                  },
                  (_, value) => {
                    if (typeof value === "bigint") return value.toString();
                    return value;
                  },
                ),
              ),
            ),
          ],
        ),
      ),
      {
        signed: false,
        size: 256,
      },
    ).toString();
  }
}
