import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { ElementsList, Button, Label } from "@shared/web/elements/index";
import { BasePage } from "@shared/web/base/base.page";

export class ConfirmSwapPage extends BasePage {
  constructor(protected override ef: ElementFinderHelper) {
    super(ef);
  }

  loadingLabel = new Label(this.ef.dataTestId("loadingLabel"));

  sellAmountLabel = new Label(this.ef.dataTestId("sellAmountLabel"));
  buyAmountLabel = new Label(this.ef.dataTestId("buyAmountLabel"));

  sellUsdAmountLabel = new Label(this.ef.dataTestId("sellUsdAmountLabel"));
  buyUsdAmountLabel = new Label(this.ef.dataTestId("buyUsdAmountLabel"));

  swapButton = new Button(this.ef.dataTestId("swapButton"));
  approveButton = new Button(this.ef.dataTestId("approveButton"));

  approveCompleteNotificationLabel = new Label(
    this.ef.text("Approve Successful"),
  );
  swapCompleteNotificationLabel = new Label(this.ef.text("Swap Successful"));
  seeDetailsLinkButton = new Button(
    this.ef.role("link", { name: "See Details" }),
  );

  headerLabel = new Label(this.ef.text("Confirm Swap"));
  swapInfo = {
    all: new ElementsList(
      Label,
      this.ef.class("w-32 pr-4 text-right dark:text-white"),
    ),
    maxSlippage: new Label(
      this.ef.class("w-32 pr-4 text-right dark:text-white").nth(0),
    ),
    minReceived: new Label(
      this.ef.class("w-32 pr-4 text-right dark:text-white").first(),
    ),
  };
  rejectApprovalTransactionNotificationLabel = new Label(
    this.ef.text("Approval transaction rejected by user"),
  );
  rejectSwapTransactionNotificationLabel = new Label(
    this.ef.text("Swap transaction rejected by user"),
  );

  staticElements = [this.headerLabel];
}
