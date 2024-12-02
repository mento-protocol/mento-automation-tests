import { Button, Label } from "@page-elements/index";
import { Network } from "@services/index";

export interface INetworkDetailsModalPo {
  titleLabel: Label;
  closeButton: Button;
  networkButtons: {
    [Network.Celo]: Button;
    [Network.Alfajores]: Button;
    [Network.Baklava]: Button;
  };
  currentNetworkLabel: Label;
  currentBlockNumberLabel: Label;
  currentNodeRpcUrlLabel: Label;
}
