import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { Input } from "@pageElements/input";
import { Button } from "@pageElements/button";
import { Label } from "@pageElements/label";
import { Dropdown } from "@pageElements/dropdown";
import { ElementsList } from "@pageElements/element-list.pe";
import { BasePo } from "@pageObjects/base.po";
import {
  ISwapPo,
  ITokenDropdownOptions,
} from "@pageObjects/types/swap.po.types";
import { Token } from "@constants/token.constants";

export class SwapPo extends BasePo implements ISwapPo {
  constructor(protected override ef: ElementFinderHelper) {
    super(ef);
  }

  private get tokenDropdownOptions(): ITokenDropdownOptions {
    return {
      [Token.CELO]: new Button(this.ef.pw.role("option", { name: Token.CELO })),
      [Token.cEUR]: new Button(this.ef.pw.role("option", { name: Token.cEUR })),
      [Token.cUSD]: new Button(this.ef.pw.role("option", { name: Token.cUSD })),
      [Token.cREAL]: new Button(
        this.ef.pw.role("option", { name: Token.cREAL }),
      ),
      [Token.cCOP]: new Button(this.ef.pw.role("option", { name: Token.cCOP })),
      [Token.USDC]: new Button(
        this.ef.pw.role("option", { name: Token.USDC, exact: true }),
      ),
      [Token.USDT]: new Button(
        this.ef.pw.role("option", { name: Token.USDT, exact: true }),
      ),
      [Token.axlUSDC]: new Button(
        this.ef.pw.role("option", { name: Token.axlUSDC, exact: true }),
      ),
      [Token.axlEUROC]: new Button(
        this.ef.pw.role("option", { name: Token.axlEUROC, exact: true }),
      ),
      [Token.eXOF]: new Button(this.ef.pw.role("option", { name: Token.eXOF })),
      [Token.cKES]: new Button(this.ef.pw.role("option", { name: Token.cKES })),
      [Token.PUSO]: new Button(this.ef.pw.role("option", { name: Token.PUSO })),
    };
  }

  headerLabel = new Label(this.ef.pw.text("Swap"));
  settingsButton = new Button(this.ef.title("Settings"));
  swapInputsButton = new Button(this.ef.title("Swap inputs"));
  showSlippageButton = new Button(this.ef.pw.role("switch"));
  allSlippageButtons = new ElementsList(
    Button,
    this.ef.all.className("RadioInput_checkmark__b0mE1"),
  );
  maxSlippageButtons = {
    "0.5%": this.allSlippageButtons.getElementByIndex(0),
    "1.0%": this.allSlippageButtons.getElementByIndex(1),
    "1.5%": this.allSlippageButtons.getElementByIndex(2),
  };
  continueButton = new Button(this.ef.pw.text("Continue"));
  fromAmountInput = new Input(this.ef.name("amount-in"));
  toAmountInput = new Input(this.ef.name("amount-out"));
  fromTokenDropdown = new Dropdown<ITokenDropdownOptions>({
    dropdownButton: this.ef.pw.role("button", { name: "From Token" }),
    options: this.tokenDropdownOptions,
  });
  toTokenDropdown = new Dropdown<ITokenDropdownOptions>({
    dropdownButton: this.ef.pw.role("button", { name: "To Token" }),
    options: this.tokenDropdownOptions,
  });

  currentPriceLabel = new Label(
    this.ef.className(
      "flex items-center justify-end px-1.5 text-xs dark:text-[#AAB3B6]",
    ),
  );
  useMaxButton = new Button(this.ef.title("Use full balance"));
  considerKeepNotificationLabel = new Label(
    this.ef.pw.text("Consider keeping some"),
  );
  amountRequiredButton = new Button(
    this.ef.pw.role("button", { name: "Amount Required" }),
  );
  amountExceedsBalanceButton = new Button(
    this.ef.pw.role("button", { name: "Amount exceeds balance" }),
  );

  staticElements = [this.headerLabel];
}
