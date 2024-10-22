import { Page } from "@playwright/test";

import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { Label } from "../pageElements/label";

export interface ICeloExplorerPo {
  getSwapTransactionStatusLabel: (page: Page) => Promise<Label>;
}

export class CeloExplorerPo implements ICeloExplorerPo {
  constructor(protected ef: ElementFinderHelper) {}

  async getSwapTransactionStatusLabel(page: Page): Promise<Label> {
    return new Label(new ElementFinderHelper({ page }).pw.text("Success"));
  }
}
