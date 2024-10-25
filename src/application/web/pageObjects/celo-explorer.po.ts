import { Page } from "@playwright/test";

import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { Label } from "@pageElements/label";
import { BasePo } from "@pageObjects/base.po";

export interface ICeloExplorerPo {
  getSwapTransactionStatusLabel: (page: Page) => Promise<Label>;
}

export class CeloExplorerPo extends BasePo implements ICeloExplorerPo {
  constructor(protected override ef: ElementFinderHelper) {
    super(ef);
  }

  staticElements = [];

  async getSwapTransactionStatusLabel(page: Page): Promise<Label> {
    return new Label(new ElementFinderHelper({ page }).pw.text("Success"));
  }
}
