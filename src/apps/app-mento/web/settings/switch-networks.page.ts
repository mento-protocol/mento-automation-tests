import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { BasePage } from "@shared/web/base/base.page";
import { Button, Label } from "@shared/web/elements/index";

export class SwitchNetworksPage extends BasePage {
  constructor(protected override ef: ElementFinderHelper) {
    super(ef);
  }

  headerLabel = new Label(this.ef.text("Switch Networks"));
  closeButton = new Button(
    this.ef.class(
      "iekbcc0 iekbcc9 ju367v4 ju367va0 ju367vc6 ju367vs ju367vt ju367vv ju367vff ju367va ju367v2b ju367v2q ju367v8u ju367v94 _12cbo8i3 ju367v8r _12cbo8i5 _12cbo8i7",
    ),
  );

  networkButtons = {
    [Network.Celo]: new Button(this.ef.dataTestId("rk-chain-option-42220")),
    [Network.Alfajores]: new Button(
      this.ef.dataTestId("rk-chain-option-44787"),
    ),
  };

  staticElements = [this.headerLabel];
}

export enum Network {
  Celo = "Celo",
  Alfajores = "Alfajores",
}
