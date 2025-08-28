import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { Button, Label } from "@shared/web/elements/index";
import { BasePage } from "@shared/web/base/base.page";
import { Network } from "./network-modal.service";

export class NetworkModalPage extends BasePage {
  constructor(protected override ef: ElementFinderHelper) {
    super(ef);
  }

  private readonly baseLocator = "networkModal";

  titleLabel = new Label(this.ef.text("Switch Networks"));

  closeButton = new Button(this.ef.title("Close"));
  networkButtons = {
    [Network.Celo]: new Button(this.ef.role("button", { name: "Celo" })),
    [Network.Alfajores]: new Button(
      this.ef.role("button", { name: "Celo Alfajores" }),
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
