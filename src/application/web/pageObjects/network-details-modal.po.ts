import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { BasePo } from "@pageObjects/base.po";
import { Button } from "@pageElements/button";
import { Label } from "@pageElements/label";

interface INetworkDetailsModalPo {
  container: Label;
  closeButton: Button;
  celoNetworkButton: Button;
  alfajoresNetworkButton: Button;
  baklavaNetworkButton: Button;
}

export class NetworkDetailsModalPo
  extends BasePo
  implements INetworkDetailsModalPo
{
  constructor(protected override ef: ElementFinderHelper) {
    super(ef);
  }

  container = new Label(this.ef.id("headlessui-dialog-panel-:rd:"));

  closeButton = new Button(this.ef.title("Close"));

  celoNetworkButton = new Button(this.ef.pw.text("Celo"));
  alfajoresNetworkButton = new Button(this.ef.pw.text("Alfajores"));
  baklavaNetworkButton = new Button(this.ef.pw.text("Baklava"));

  staticElements = [this.container];
}
