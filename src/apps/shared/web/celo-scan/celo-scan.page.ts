import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { BasePage } from "@shared/web/base/base.page";
import { Button, ElementsList, Label } from "../elements/index";

export class CeloScanPage extends BasePage {
  constructor(public override ef: ElementFinderHelper) {
    super(ef);
  }

  logsButton = new Button(this.ef.text("Logs"));

  header = new Label(this.ef.id("masterTopBar"));

  logRows = new ElementsList(Label, this.ef.class("mt-2 mt-sm-1 d-lg-flex"));

  staticElements = [this.header];
}
