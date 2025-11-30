import { GovernanceContract } from "@shared/contracts/governance/governance.contract";
import { IGetBalanceParams } from "@shared/contracts/base/base.contract";

export class ContractHelper {
  public readonly governance: GovernanceContract = null;

  constructor() {
    this.governance = new GovernanceContract();
  }

  async getBalance(params: IGetBalanceParams): Promise<number> {
    return this.governance.getBalance(params);
  }
}

export const contractHelper = new ContractHelper();
