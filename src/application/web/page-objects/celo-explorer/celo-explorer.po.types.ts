import { Page } from "@playwright/test";

import { Label } from "@page-elements/index";

export interface ICeloExplorerPo {
  getSwapTransactionStatusLabel: (page: Page) => Promise<Label>;
}
