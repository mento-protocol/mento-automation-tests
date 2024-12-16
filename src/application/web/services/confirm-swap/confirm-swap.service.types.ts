import { IBaseServiceArgs } from "@services/index";
import { ConfirmSwapPo } from "@page-objects/index";
import { IWallet } from "@fixtures/common/common.fixture.types";

export interface IConfirmSwapService {
  getCurrentPriceFromConfirmation: () => Promise<string>;
  getCurrentPriceFromSwap: (waitTimeout?: number) => Promise<string>;
  finish: (wallet: IWallet) => Promise<void>;
  expectSuccessfulNotifications: () => Promise<void>;
  navigateToCeloExplorer: () => Promise<void>;
  isSwapPerformingPopupThere: () => Promise<boolean>;
  isApproveCompleteNotificationThere: () => Promise<boolean>;
  isSwapCompleteNotificationThere: () => Promise<boolean>;
  isRejectApprovalTransactionNotificationThere: () => Promise<boolean>;
  isRejectSwapTransactionNotificationThere: () => Promise<boolean>;
}

export interface IConfirmSwapServiceArgs extends IBaseServiceArgs {
  page: ConfirmSwapPo;
}
