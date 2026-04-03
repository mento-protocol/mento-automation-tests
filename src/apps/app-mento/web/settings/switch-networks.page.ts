import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { ElementAttribute } from "@helpers/element-finder/element-finder.helpet.types";
import { ChainName } from "@helpers/env/env.helper";
import { BasePage } from "@shared/web/base/base.page";
import { Button, Label } from "@shared/web/elements/index";

export class SwitchNetworksPage extends BasePage {
  constructor(protected override ef: ElementFinderHelper) {
    super(ef);
  }

  networkPopover = new Label(
    this.ef.custom({
      attributeName: ElementAttribute.dataSlot,
      attributeValue: "dropdown-menu-content",
    }),
  );

  networkButtons = {
    [ChainName.Celo]: new Button(
      this.networkPopover.element.locator(
        this.ef.text(ChainName.Celo, { exact: true }),
      ),
    ),
    [ChainName.Monad]: new Button(
      this.networkPopover.element.locator(
        this.ef.text(ChainName.Monad, { exact: true }),
      ),
    ),
    [ChainName.CeloSepolia]: new Button(
      this.networkPopover.element.locator(this.ef.text(ChainName.CeloSepolia)),
    ),
    [ChainName.MonadTestnet]: new Button(
      this.networkPopover.element.locator(this.ef.text(ChainName.MonadTestnet)),
    ),
  };

  staticElements = [
    this.networkButtons[ChainName.Celo],
    this.networkButtons[ChainName.Monad],
  ];
}
