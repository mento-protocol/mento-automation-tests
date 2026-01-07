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

  chainInput = new Input(this.ef.placeholder("Chain"));
  chainListRoot = this.ef.class(
    "tw-gap-squid-xxs tw-py-squid-xs tw-flex tw-flex-col",
  );
  chainList = {
    celo: new Label(this.chainListRoot.locator(this.ef.text("Celo"))),
  };

  approveButton = new Button(
    this.ef.role("button", { name: "Give permission to use tokens" }),
  );

  swapButton = new Button(this.ef.role("button", { name: "Swap" }).nth(1));
  swapCompleteLabel = new Label(this.ef.text("Swap complete"));

  tokenNameInput = new Input(this.ef.placeholder("Token"));

  yourTokensLabel = new Label(this.ef.text("Your tokens"));

  getTokenButtonByName(name: string, { exact = false } = {}): Button {
    // There are several CELO and USDC buttons
    const secondTokenButtons = [TokenSymbol.CELO, TokenSymbol.USDC] as string[];
    const isSecondToken = secondTokenButtons.includes(name);
    return new Button(
      this.ef.role("button", { name, exact }).nth(isSecondToken ? 1 : 0),
    );
  }

  staticElements = [];
}
