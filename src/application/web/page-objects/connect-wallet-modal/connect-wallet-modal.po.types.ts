import { WalletName } from "@services/index";
import { Button, Label } from "@page-elements/index";

export interface IConnectWalletModalPo {
  connectWalletModalLabel: Label;
  walletList: { [WalletName.Metamask]: Button };
  closeButton: Button;
}
