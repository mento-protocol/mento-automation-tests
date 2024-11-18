import { Button } from "@pageElements/button";
import { Token } from "@constants/token.constants";
import { Dropdown } from "@pageElements/dropdown";
import { Label } from "@pageElements/label";
import { ElementsList } from "@pageElements/element-list.pe";
import { Input } from "@pageElements/input";

export interface ITokenDropdownOptions extends Record<string, Button> {
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
}

export interface ISwapPo {
  fromTokenDropdown: Dropdown<ITokenDropdownOptions>;
  toTokenDropdown: Dropdown<ITokenDropdownOptions>;
  headerLabel: Label;
  settingsButton: Button;
  swapInputsButton: Button;
  showSlippageButton: Button;
  allSlippageButtons: ElementsList<Button>;
  maxSlippageButtons: Record<string, Button>;
  continueButton: Button;
  fromAmountInput: Input;
  toAmountInput: Input;
  currentPriceLabel: Label;
  useMaxButton: Button;
  considerKeepNotificationLabel: Label;
  amountRequiredButton: Button;
  amountExceedsBalanceButton: Button;
  amountTooSmallButton: Button;
}
