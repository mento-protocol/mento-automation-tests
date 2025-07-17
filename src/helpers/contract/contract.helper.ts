import { GovernanceContract } from "@shared/contracts/governance/governance.contract";

export class ContractHelper {
  constructor() {}

  public get governance() {
    return new GovernanceContract();
  }
}

export const contractHelper = new ContractHelper();
