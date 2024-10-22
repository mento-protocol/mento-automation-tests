import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { Label } from "@web/pageElements/label";
import { Button } from "@web/pageElements/button";
import { ElementsList } from "@web/pageElements/element-list.pe";

export interface IConfirmSwapPo {
  swapInfo: {
    maxSlippage: Label;
    minReceived: Label;
  };
}

export class ConfirmSwapPo implements IConfirmSwapPo {
  constructor(protected ef: ElementFinderHelper) {}

  swapPerformingPopupLabel = new Label(this.ef.pw.text("Performing Swap"));
  swapPerformingPopupCloseButton = new Button(
    this.ef.pw.role("button", { name: "Close" }),
  );
  approveCompleteNotificationLabel = new Label(
    this.ef.pw.text("Approve complete, starting"),
  );
  swapCompleteNotificationLabel = new Label(
    this.ef.pw.text("Swap Complete! See Details"),
  );
  seeDetailsLinkButton = new Button(
    this.ef.pw.role("link", { name: "See Details" }),
  );

  headerLabel = new Label(this.ef.pw.role("heading", { name: "Confirm Swap" }));
  swapInfo = {
    all: new ElementsList(
      Label,
      this.ef.all.className("w-32 pr-4 text-right dark:text-white"),
    ),
    maxSlippage: new Label(
      this.ef.all
        .className("w-32 pr-4 text-right dark:text-white")
        .getElementByIndex(0),
    ),
    minReceived: new Label(
      this.ef.all
        .className("w-32 pr-4 text-right dark:text-white")
        .getElementByIndex(1),
    ),
  };
  swapButton = new Button(this.ef.pw.role("button", { name: "Swap" }));
  currentPriceLabel = new Label(
    this.ef.className(
      "py-2 w-full flex items-center justify-center text-sm rounded-b text-[#AAB3B6]",
    ),
  );
  rejectedTransactionNotificationLabel = new Label(
    this.ef.pw.text("Unable to execute approval transaction"),
  );
}
