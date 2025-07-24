import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { ElementsList, Button, Label } from "@shared/web/elements/index";
import { BasePage } from "@shared/web/base/base.page";

export class ConfirmSwapPage extends BasePage {
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
    this.ef.pw.text("Approve Successful"),
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
