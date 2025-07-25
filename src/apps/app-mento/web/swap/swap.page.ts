import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { Button, Input, Label } from "@shared/web/elements/index";
import { Token } from "@constants/token.constants";
import { BasePage } from "@shared/web/base/base.page";

export class SwapPage extends BasePage {
  constructor(protected override ef: ElementFinderHelper) {
    super(ef);
  }

  getSelectedTokenLabel(tokenName: Token) {
    return new Label(this.ef.pw.text(tokenName, { exact: true }));
  }

  invalidPairTooltip = new Label(
    this.ef.pw.dataTestId("invalidPairTooltip", {}, { takeFirstElement: true }),
  );
  selectSellTokenButton = new Button(
    this.ef.dataTestId("selectSellTokenButton"),
  );
  selectBuyTokenButton = new Button(this.ef.dataTestId("selectBuyTokenButton"));
  selectTokenToSellLabel = new Button(
    this.ef.pw.role("button", { name: "Select token to sell" }),
  );
  selectTokenToBuyLabel = new Button(
    this.ef.pw.role("button", { name: "Select token to buy" }),
  );
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
    this.ef.pw.dataTestId("insufficientBalanceButton"),
  );
  swapsExceedsLimitsButton = new Button(
    this.ef.pw.dataTestId("swapsExceedsTradingLimitButton"),
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

export interface ITokenOptions extends Record<string, Button> {
  [Token.CELO]: Button;
  [Token.cEUR]: Button;
  [Token.cUSD]: Button;
  [Token.cREAL]: Button;
  [Token.cKES]: Button;
  [Token.cCOP]: Button;
  [Token.axlUSDC]: Button;
  [Token.axlEUROC]: Button;
  [Token.eXOF]: Button;
  [Token.USDT]: Button;
  [Token.USDC]: Button;
  [Token.PUSO]: Button;
  [Token.cGHS]: Button;
  [Token.cGBP]: Button;
  [Token.cZAR]: Button;
  [Token.cCAD]: Button;
  [Token.cAUD]: Button;
}
