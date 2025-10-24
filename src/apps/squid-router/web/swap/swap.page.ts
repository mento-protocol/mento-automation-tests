import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { Button, Input, Label } from "@shared/web/elements/index";
import { BasePage } from "@shared/web/base/base.page";
import { TokenSymbol } from "@constants/index";

export class SwapPage extends BasePage {
  constructor(protected override ef: ElementFinderHelper) {
    super(ef);
  }

  private amountLocator = this.ef.placeholder("0", { exact: false });

  amountInputs = {
    sell: new Input(this.amountLocator.first()),
    buy: new Input(this.amountLocator.nth(1)),
  };

  tokenSelectors = {
    sell: new Button(this.ef.role("button", { name: "ETH ETH" })),
    buy: new Button(
      this.ef.role("button", { name: "Select token", exact: true }),
    ),
  };

  enterAmountLabel = new Label(
    this.ef.role("button", { name: "Enter amount" }),
  );
  selectTokensLabel = new Label(
    this.ef.role("button", { name: "Select tokens", exact: true }),
  );

  allChainsButton = new Button(this.ef.role("button", { name: "All Chains" }));

  approveButton = new Button(
    this.ef.role("button", { name: "Give permission to use tokens" }),
  );

  swapButton = new Button(this.ef.role("button", { name: "Swap" }).nth(1));
  swapCompleteLabel = new Label(this.ef.text("Swap complete"));

  tokenNameInput = new Input(this.ef.placeholder("Token"));

  yourTokensLabel = new Label(this.ef.text("Your tokens"));

  getTokenButtonByName(name: string, { exact = false } = {}): Button {
    const isCelo = name === TokenSymbol.CELO;
    // There are two CELO buttons
    return new Button(
      this.ef.role("button", { name, exact }).nth(isCelo ? 2 : 0),
    );
  }

  staticElements = [];
}

// export interface ITokenOptions extends Record<string, Button> {
//   [Token.CELO]: Button;
//   [Token.cEUR]: Button;
//   [Token.cUSD]: Button;
//   [Token.cREAL]: Button;
//   [Token.cKES]: Button;
//   [Token.cCOP]: Button;
//   [Token.axlUSDC]: Button;
//   [Token.axlEUROC]: Button;
//   [Token.eXOF]: Button;
//   [Token.USDT]: Button;
//   [Token.USDC]: Button;
//   [Token.PUSO]: Button;
//   [Token.cGHS]: Button;
//   [Token.cGBP]: Button;
//   [Token.cZAR]: Button;
//   [Token.cCAD]: Button;
//   [Token.cAUD]: Button;
// }
