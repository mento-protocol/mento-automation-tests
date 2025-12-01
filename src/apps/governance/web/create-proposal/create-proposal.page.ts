import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { Button, Input, Label } from "@shared/web/elements/index";
import { BasePage } from "@shared/web/base/base.page";

export class CreateProposalPage extends BasePage {
  constructor(protected override ef: ElementFinderHelper) {
    super(ef);
  }

  headerPageLabel = new Label(this.ef.text("Create New Proposal"));

  nextButton = new Button(this.ef.role("button", { name: "Next" }).first());
  previousButton = new Button(this.ef.dataTestId("previousButton"));

  proposalDetailsStage = {
    stageLabel: new Label(this.ef.dataTestId("proposalDetailsStageLabel")),
    titleInput: new Input(this.ef.dataTestId("proposalTitleInput")),
    descriptionInput: new Input(this.ef.dataTestId("proposalDescriptionInput")),
  };

  executionCodeStage = {
    stageLabel: new Label(this.ef.dataTestId("executionCodeStageLabel")),
    codeInput: new Input(this.ef.dataTestId("executionCodeInput")),
  };

  reviewStage = {
    stageLabel: new Label(this.ef.dataTestId("reviewStageLabel")),
    createProposalButton: new Button(
      this.ef.dataTestId("createProposalButton"),
    ),
    seeAllProposalDetailsButton: new Button(
      this.ef.dataTestId("seeAll_proposalDetailsButton"),
    ),
    proposalDetailsContent: new Label(
      this.ef.dataTestId("proposalDetailsContent"),
    ),
    seeLessProposalDetailsButton: new Button(
      this.ef.dataTestId("seeLess_proposalDetailsButton"),
    ),
    seeAllExecutionCodeButton: new Button(
      this.ef.dataTestId("seeAll_executionCodeButton"),
    ),
    executionCodeContent: new Label(this.ef.dataTestId("executionCodeContent")),
    seeLessExecutionCodeButton: new Button(
      this.ef.dataTestId("seeLess_executionCodeButton"),
    ),
  };

  confirmProposalPopup = new Label(
    this.ef.text(
      "Please sign the proposal creation transaction in your wallet",
    ),
  );
  proposalSuccessToast = {
    toast: new Label(this.ef.text("Proposal created successfully!")),
    seeDetailsButton: new Button(this.ef.text("See Details")),
  };

  proposalCreationRejectedByUserToastLabel = new Label(
    this.ef.text("Proposal creation rejected by user"),
  );

  staticElements = [this.headerPageLabel, this.proposalDetailsStage.titleInput];
}
