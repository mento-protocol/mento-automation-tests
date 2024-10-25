import { BrowserContext } from "@playwright/test";

import { BaseService } from "@services/base.service";
import { timeouts } from "@constants/timeouts.constants";
import { CeloExplorerPo } from "@pageObjects/celo-explorer.po";
import { ICeloExplorerServiceArgs } from "@services/types/swap.service.types";
import { ClassLog } from "@decorators/logger.decorators";

export interface ICeloExplorerService {
  isTransactionSuccess: (
    context: BrowserContext,
    navigateMethod: unknown,
  ) => Promise<boolean>;
}

@ClassLog
export class CeloExplorerService
  extends BaseService
  implements ICeloExplorerService
{
  protected override page: CeloExplorerPo = null;

  constructor(args: ICeloExplorerServiceArgs) {
    const { page } = args;
    super(args);
    this.page = page;
  }

  async isTransactionSuccess(
    context: BrowserContext,
    navigateMethod: unknown,
  ): Promise<boolean> {
    const newPage = await this.page.navigateToNewTab(context, navigateMethod);
    const swapTransactionStatusLabel =
      await this.page.getSwapTransactionStatusLabel(newPage);
    return swapTransactionStatusLabel.waitUntilDisplayed(timeouts.xxxs, {
      throwError: false,
    });
  }
}
