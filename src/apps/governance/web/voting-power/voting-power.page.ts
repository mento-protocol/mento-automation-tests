import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { Label } from "@shared/web/elements/index";
import { BasePage } from "@shared/web/base/base.page";

export class VotingPowerPage extends BasePage {
  constructor(protected override ef: ElementFinderHelper) {
    super(ef);
  }

  headerLabel = new Label(this.ef.pw.text("My Voting Power"));

  staticElements = [this.headerLabel];
}
