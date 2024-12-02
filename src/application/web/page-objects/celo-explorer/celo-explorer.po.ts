import { Page } from "@playwright/test";

import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { BasePo, ICeloExplorerPo } from "@page-objects/index";
import { Label } from "@page-elements/index";

export class CeloExplorerPo extends BasePo implements ICeloExplorerPo {
  constructor(protected override ef: ElementFinderHelper) {
    super(ef);
  }

  staticElements = [];

  async getSwapTransactionStatusLabel(page: Page): Promise<Label> {
    return new Label(new ElementFinderHelper({ page }).pw.text("Success"));
  }
}
