import { Button, Label } from "@page-elements/index";

export interface IConfirmSwapPo {
  swapPerformingPopupLabel: Label;
  swapPerformingPopupCloseButton: Button;
  approveCompleteNotificationLabel: Label;
  swapCompleteNotificationLabel: Label;
  seeDetailsLinkButton: Button;
  headerLabel: Label;
  swapInfo: {
    maxSlippage: Label;
    minReceived: Label;
  };
  swapButton: Button;
  currentPriceLabel: Label;
  rejectApprovalTransactionNotificationLabel: Label;
  rejectSwapTransactionNotificationLabel: Label;
}
