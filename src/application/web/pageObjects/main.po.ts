import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { MainPoInterface } from "@pageObjects/types/main.po.types";
import { Button } from "@pageElements/button";
import { ElementsList } from "@pageElements/element-list.pe";
import { BasePo } from "@pageObjects/base.po";

export class MainPo extends BasePo implements MainPoInterface {
  constructor(protected override ef: ElementFinderHelper) {
    super(ef);
  }

  connectButton = new Button(
    this.ef.pw.role("button", { name: "Connect", exact: true }),
  );
  walletTypeButtons = new ElementsList(
    Button,
    this.ef.all.className(
      "iekbcc0 ju367vj ju367v26 ju367v67 ju367v8m ju367v8y",
    ),
  );

  staticElements = [this.connectButton];
}
