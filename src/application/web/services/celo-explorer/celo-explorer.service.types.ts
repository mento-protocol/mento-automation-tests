import { BrowserContext } from "@playwright/test";

import { IBaseServiceArgs } from "@services/index";
import { CeloExplorerPo } from "@page-objects/index";

export interface ICeloExplorerService {
  isTransactionSuccess: (
    context: BrowserContext,
    navigateMethod: unknown,
  ) => Promise<boolean>;
}

export interface ICeloExplorerServiceArgs extends IBaseServiceArgs {
  page: CeloExplorerPo;
}
