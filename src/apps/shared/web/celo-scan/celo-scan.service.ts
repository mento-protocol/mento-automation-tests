import { ClassLog } from "@decorators/logger.decorators";
import { timeouts } from "@constants/timeouts.constants";
import { BaseService, IBaseServiceArgs } from "@shared/web/base/base.service";
import { CeloScanPage } from "./celo-scan.page";

@ClassLog
export class CeloScanService extends BaseService {
  public override page: CeloScanPage = null;

  constructor(args: ICeloScanArgs) {
    const { page } = args;
    super(args);
    this.page = page;
  }

  async openLogs(txUrl: string): Promise<void> {
    await this.browser.openUrl(`${txUrl}#eventlog`);
    await this.page.logRows.getElementByIndex(0).waitForDisplayed(timeouts.xs, {
      errorMessage: "Logs section is not opened!",
    });
  }

  async getLogRowContent(logRowIndex: number): Promise<string> {
    return await this.page.logRows.getElementByIndex(logRowIndex).getText();
  }
}

export interface ICeloScanArgs extends IBaseServiceArgs {
  page: CeloScanPage;
}
