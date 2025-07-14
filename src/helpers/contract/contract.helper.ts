import { GovernanceHelper } from "./governance/governance.helper";

export class ContractHelper {
  public readonly governance: GovernanceHelper;

  constructor() {
    this.governance = new GovernanceHelper();
  }
}

export const contractHelper = new ContractHelper();
