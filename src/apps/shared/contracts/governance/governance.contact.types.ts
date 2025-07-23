import { Address, TransactionReceipt } from "viem";

interface IExecutionCode {
  address: Address;
  value: string | number;
  data: string;
}

export interface ICreateProposalParams {
  title?: string;
  description?: string;
  executionCode?: IExecutionCode[];
  throwError?: boolean;
}

export interface ICreateProposalResult {
  txHash: string;
  receipt: TransactionReceipt;
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
