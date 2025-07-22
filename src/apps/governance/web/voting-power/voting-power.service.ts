import { BaseService, IBaseServiceArgs } from "@shared/web/base/base.service";
import { ClassLog } from "@decorators/logger.decorators";
import { VotingPowerPage } from "./voting-power.page";

@ClassLog
export class VotingPowerService extends BaseService {
  public override page: VotingPowerPage = null;

  constructor(args: IVotingPowerServiceArgs) {
    const { page } = args;
    super(args);
    this.page = page;
  }

  async enterAmount(amount: string): Promise<void> {
    await this.page.lockAmountInput.click();
    await this.browser.enterTextByKeyboard(amount);
  }
}

interface IVotingPowerServiceArgs extends IBaseServiceArgs {
  page: VotingPowerPage;
}
