import { Button, Label } from "@page-elements/index";
import { Token } from "@constants/token.constants";

export interface IWalletSettingsPopupPo {
  getTokenBalanceLabelByName: (name: Token) => Label;
  copyAddressButton: Button;
  changeNetworkButton: Button;
  disconnectButton: Button;
}
