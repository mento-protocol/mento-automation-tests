import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { BasePo } from "@pageObjects/base.po";
import { Button } from "@pageElements/button";
import { Label } from "@pageElements/label";
import { Network } from "@services/network-details-modal.service";

interface INetworkDetailsModalPo {
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

export class NetworkDetailsModalPo
  extends BasePo
  implements INetworkDetailsModalPo
{
  constructor(protected override ef: ElementFinderHelper) {
    super(ef);
  }

  private readonly baseLocator = "networkModal";

  titleLabel = new Label(this.ef.pw.text("Network details"));

  closeButton = new Button(this.ef.title("Close"));
  networkButtons = {
    [Network.Celo]: new Button(this.ef.pw.text("Celo")),
    [Network.Alfajores]: new Button(this.ef.pw.text("Alfajores")),
    [Network.Baklava]: new Button(this.ef.pw.text("Baklava")),
  };

  // LOCATORS STILL NOT MERGED INTO MAIN
  currentNetworkLabel = new Label(
    this.ef.dataTestId(`${this.baseLocator}_currentNetwork`),
  );
  currentBlockNumberLabel = new Label(
    this.ef.dataTestId(`${this.baseLocator}_currentBlockNumber`),
  );
  currentNodeRpcUrlLabel = new Label(
    this.ef.dataTestId(`${this.baseLocator}_currentNodeRpcUrl`),
  );

  staticElements = [this.titleLabel];
}
