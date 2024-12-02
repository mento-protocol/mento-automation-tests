import { BrowserContext } from "@playwright/test";

import { timeouts } from "@constants/timeouts.constants";
import { CeloExplorerPo } from "@page-objects/index";
import { ClassLog } from "@decorators/logger.decorators";
import {
  ICeloExplorerService,
  ICeloExplorerServiceArgs,
  BaseService,
} from "@services/index";

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
