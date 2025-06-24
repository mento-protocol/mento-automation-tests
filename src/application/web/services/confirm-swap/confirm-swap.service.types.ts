import { IBaseServiceArgs } from "@services/index";
import { ConfirmSwapPo } from "@page-objects/index";
import { MetamaskHelper } from "@helpers/wallet/metamask-wallet.helper";

export interface IConfirmSwapService {
  getRate: () => Promise<string>;
  getCurrentPriceFromSwap: (waitTimeout?: number) => Promise<string>;
  confirm: (metamaskHelper: MetamaskHelper) => Promise<void>;
  navigateToCeloExplorer: () => Promise<void>;
  isSwapPerformingPopupThere: () => Promise<boolean>;
  isApproveCompleteNotificationThere: () => Promise<boolean>;
  isRejectApprovalTxNotificationThere: () => Promise<boolean>;
  isRejectSwapTxNotificationThere: () => Promise<boolean>;
}

export interface IConfirmSwapServiceArgs extends IBaseServiceArgs {
  page: ConfirmSwapPo;
}

export interface IExpectChangedBalanceArgs {
  initialBalance: number;
  currentBalance: number;
}
