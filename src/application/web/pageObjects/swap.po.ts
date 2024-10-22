import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { Input } from "../pageElements/input";
import { Button } from "../pageElements/button";
import { Label } from "../pageElements/label";
import { Dropdown } from "@web/pageElements/dropdown";
import { ElementsList } from "@web/pageElements/element-list.pe";

export interface ISwapPo {
  fromDropdown: Dropdown;
}

export class SwapPo implements ISwapPo {
  constructor(protected ef: ElementFinderHelper) {}

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
  fromDropdown = new Dropdown({
    dropdownButton: this.ef.id("headlessui-listbox-button-:r2:"),
    options: {
      CELO: new Button(this.ef.pw.role("option", { name: "CELO" })),
      cEUR: new Button(this.ef.pw.role("option", { name: "cEUR" })),
      cUSD: new Button(this.ef.pw.role("option", { name: "cUSD" })),
      cREAL: new Button(this.ef.pw.role("option", { name: "cREAL" })),
    },
  });
  toDropdown = new Dropdown({
    dropdownButton: this.ef.id("headlessui-listbox-button-:r3:"),
    options: {
      CELO: new Button(this.ef.pw.role("option", { name: "CELO" })),
      cEUR: new Button(this.ef.pw.role("option", { name: "cEUR" })),
      cUSD: new Button(this.ef.pw.role("option", { name: "cUSD" })),
      cREAL: new Button(this.ef.pw.role("option", { name: "cREAL" })),
    },
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
}
