import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { Button, Input, Label } from "@page-elements/index";
import { Token } from "@constants/token.constants";
import { BasePo } from "@page-objects/index";

export class SwapPo extends BasePo {
  constructor(protected override ef: ElementFinderHelper) {
    super(ef);
  }

  getSelectedTokenLabel(tokenName: Token) {
    return new Label(this.ef.pw.text(tokenName, { exact: true }));
  }

  selectSellTokenButton = new Button(
    this.ef.dataTestId("selectSellTokenButton"),
  );
  selectBuyTokenButton = new Button(this.ef.dataTestId("selectBuyTokenButton"));
  headerLabel = new Label(this.ef.pw.text("Swap"));
  slippageButton = new Button(this.ef.dataTestId("slippageButton"));
  swapInputsButton = new Button(this.ef.dataTestId("swapInputsButton"));
  loadingLabel = new Label(this.ef.pw.dataTestId("loadingLabel"));
  swapButton = new Button(this.ef.dataTestId("swapButton"));
  approveButton = new Button(this.ef.dataTestId("approveButton"));

  sellUsdAmountLabel = new Label(this.ef.dataTestId("sellUsdAmountLabel"));
  buyUsdAmountLabel = new Label(this.ef.dataTestId("buyUsdAmountLabel"));

  sellAmountInput = new Input(this.ef.dataTestId("sellAmountInput"));
  buyAmountInput = new Input(this.ef.dataTestId("buyAmountInput"));

  useMaxButton = new Button(this.ef.pw.role("button", { name: "MAX" }));
  considerKeepNotificationLabel = new Label(
    this.ef.pw.text(
      "Consider keeping some CELO",
      {},
      { takeFirstElement: true },
    ),
  );
  amountRequiredButton = new Button(
    this.ef.pw.role("button", { name: "Amount Required" }),
  );
  insufficientBalanceButton = new Button(
    this.ef.pw.text("Insufficient Balance"),
  );
  swapsExceedsLimitsButton = new Button(
    this.ef.pw.text("Swap exceeds trading limits"),
  );
  amountTooSmallButton = new Button(
    this.ef.pw.role("button", { name: "Amount too small" }),
  );
  errorButton = new Button(this.ef.pw.role("button", { name: "Error" }));
  exceedsTradingLimitNotificationLabel = new Label(
    this.ef.pw.text("amount exceeds the current trading limit"),
  );

  staticElements = [this.headerLabel];
}
