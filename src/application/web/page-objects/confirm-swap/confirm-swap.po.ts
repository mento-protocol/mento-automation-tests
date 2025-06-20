import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { ElementsList, Button, Label } from "@page-elements/index";
import { BasePo } from "@page-objects/index";

export class ConfirmSwapPo extends BasePo {
  constructor(protected override ef: ElementFinderHelper) {
    super(ef);
  }

  sellAmountLabel = new Label(this.ef.dataTestId("sellAmountLabel"));
  buyAmountLabel = new Label(this.ef.dataTestId("buyAmountLabel"));

  sellUsdAmountLabel = new Label(this.ef.dataTestId("sellUsdAmountLabel"));
  buyUsdAmountLabel = new Label(this.ef.dataTestId("buyUsdAmountLabel"));

  swapButton = new Button(this.ef.dataTestId("swapButton"));
  approveButton = new Button(this.ef.dataTestId("approveButton"));

  approveCompleteNotificationLabel = new Label(
    this.ef.pw.text("Approve complete! Sending swap tx"),
  );
  swapCompleteNotificationLabel = new Label(this.ef.pw.text("Swap Successful"));
  seeDetailsLinkButton = new Button(
    this.ef.pw.role("link", { name: "See Details" }),
  );

  headerLabel = new Label(this.ef.pw.text("Confirm Swap"));
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
  rejectApprovalTransactionNotificationLabel = new Label(
    this.ef.pw.text("Approval transaction rejected by user"),
  );
  rejectSwapTransactionNotificationLabel = new Label(
    this.ef.pw.text("Swap transaction rejected by user"),
  );

  staticElements = [this.headerLabel];
}
