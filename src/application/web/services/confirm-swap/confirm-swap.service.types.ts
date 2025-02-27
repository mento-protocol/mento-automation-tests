import { IBaseServiceArgs } from "@services/index";
import { ConfirmSwapPo } from "@page-objects/index";
import { IMetamaskHelper } from "@helpers/wallet/metamask-wallet.helper";

export interface IConfirmSwapService {
  getCurrentPriceFromConfirmation: () => Promise<string>;
  getCurrentPriceFromSwap: (waitTimeout?: number) => Promise<string>;
  process: (metamaskHelper: IMetamaskHelper) => Promise<void>;
  navigateToCeloExplorer: () => Promise<void>;
  isSwapPerformingPopupThere: () => Promise<boolean>;
  isApproveCompleteNotificationThere: () => Promise<boolean>;
  isRejectApprovalTransactionNotificationThere: () => Promise<boolean>;
  isRejectSwapTransactionNotificationThere: () => Promise<boolean>;
}

export interface IConfirmSwapServiceArgs extends IBaseServiceArgs {
  page: ConfirmSwapPo;
}

export interface IExpectChangedBalanceArgs {
  initialBalance: number;
  currentBalance: number;
}
