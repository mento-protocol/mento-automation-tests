import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { Label } from "@shared/web/elements/index";
import { BasePage } from "@shared/web/base/base.page";

export class ConfirmOrderPopupPage extends BasePage {
  constructor(protected override ef: ElementFinderHelper) {
    super(ef);
  }

  signTransactionLabel = new Label(this.ef.text("Sign transaction"));
  signMessageStageLabel = new Label(
    this.ef.text("Sign message", { exact: false }).first(),
  );
  signMessageDescriptionLabel = new Label(
    this.ef.text("Sign message in the wallet"),
  );

  pendingApprovalLabel = new Label(this.ef.text("Pending approval"));
  approveStageLabel = new Label(this.ef.text("Approve").first());
  confirmSwapStageLabel = new Label(this.ef.text("Confirm Swap"));

  staticElements = [this.approveStageLabel, this.confirmSwapStageLabel];
}
