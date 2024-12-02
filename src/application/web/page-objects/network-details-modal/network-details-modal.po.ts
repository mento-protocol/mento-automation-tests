import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { Button, Label } from "@page-elements/index";
import { Network } from "@services/index";
import { INetworkDetailsModalPo, BasePo } from "@page-objects/index";

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
    [Network.Celo]: new Button(this.ef.pw.role("button", { name: "Celo" })),
    [Network.Alfajores]: new Button(
      this.ef.pw.role("button", { name: "Alfajores" }),
    ),
    [Network.Baklava]: new Button(
      this.ef.pw.role("button", { name: "Baklava" }),
    ),
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
