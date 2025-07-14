import { Address } from "viem";

interface IExecutionCode {
  address: Address;
  value: string | number;
  data: string;
}

export interface ICreateProposalParams {
  title: string;
  description: string;
  executionCode: IExecutionCode[];
}

export interface ICreateProposalResult {
  proposalId: string;
  success: boolean;
  error?: string;
  transactionHash?: string;
}

export interface IProposalValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface IProposalData {
  targets: Address[];
  values: bigint[];
  calldatas: string[];
  description: string;
}
