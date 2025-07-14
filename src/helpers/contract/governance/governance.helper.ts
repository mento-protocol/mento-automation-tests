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
import { ethers, providers, Signer } from "ethers";

import { ClassLog } from "@decorators/logger.decorators";
import { envHelper } from "@helpers/env/env.helper";
import { loggerHelper } from "@helpers/logger/logger.helper";
import { magicStrings } from "@constants/magic-strings.constants";
import {
  ICreateProposalParams,
  ICreateProposalResult,
  IProposalData,
} from "../governance.helper.types";

const log = loggerHelper.get("GovernanceHelper");

@ClassLog
export class GovernanceHelper {
  private readonly governorAddress: Address = null;
  private readonly provider: providers.Provider = null;
  private readonly signer: Signer = null;

  private readonly governorAbi = magicStrings.governance.abi;
  private readonly proposalData = magicStrings.governance.proposalData;

  constructor() {
    this.governorAddress = envHelper.getGovernorAddress();
    this.provider = new ethers.providers.JsonRpcProvider(envHelper.getRpcUrl());
    this.signer = new ethers.Wallet(envHelper.getPrivateKey(), this.provider);
  }

  async createProposal({
    title = this.proposalData.title,
    description = this.proposalData.description,
    executionCode = this.proposalData.executionCode,
  }: ICreateProposalParams): Promise<ICreateProposalResult> {
    try {
      const proposal: ICreateProposalParams = {
        title,
        description,
        executionCode,
      };

      const proposalId = this.createProposalId(proposal);
      const proposalData = this.prepareProposalData(proposal);
      const transactionHash = await this.callContract(proposalData);

      return {
        proposalId,
        success: true,
        transactionHash,
      };
    } catch (error) {
      log.error(`Error in 'createProposal' method: ${error}`);
      log.error(`Error stack: ${error.stack}`);
      return {
        proposalId: "",
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
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

  private async callContract(proposalData: IProposalData): Promise<string> {
    try {
      const contract = new ethers.Contract(
        this.governorAddress,
        this.governorAbi,
        this.signer,
      );

      // Call the propose function
      const tx = await contract.propose(
        proposalData.targets,
        proposalData.values,
        proposalData.calldatas,
        proposalData.description,
        {
          gasLimit: 5000000, // Adjust gas limit as needed
        },
      );

      // Wait for transaction to be mined
      const receipt = await tx.wait();

      return receipt.transactionHash;
    } catch (error) {
      console.error("Contract call failed:", error);
      throw new Error(
        `Contract call failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    }
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
