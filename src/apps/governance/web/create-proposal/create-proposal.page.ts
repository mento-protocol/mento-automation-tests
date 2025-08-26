import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { Button, Input, Label } from "@shared/web/elements/index";
import { BasePage } from "@shared/web/base/base.page";

export class CreateProposalPage extends BasePage {
  constructor(protected override ef: ElementFinderHelper) {
    super(ef);
  }

  headerPageLabel = new Label(this.ef.pw.text("Create New Proposal"));

  nextButton = new Button(
    this.ef.pw.role("button", { name: "Next" }, { takeFirstElement: true }),
  );
  previousButton = new Button(this.ef.pw.dataTestId("previousButton"));

  proposalDetailsStage = {
    stageLabel: new Label(this.ef.pw.dataTestId("proposalDetailsStageLabel")),
    titleInput: new Input(this.ef.pw.dataTestId("proposalTitleInput")),
    descriptionInput: new Input(
      this.ef.pw.dataTestId("proposalDescriptionInput"),
    ),
  };

  executionCodeStage = {
    stageLabel: new Label(this.ef.pw.dataTestId("executionCodeStageLabel")),
    codeInput: new Input(this.ef.pw.dataTestId("executionCodeInput")),
  };

  reviewStage = {
    stageLabel: new Label(this.ef.pw.dataTestId("reviewStageLabel")),
    createProposalButton: new Button(
      this.ef.pw.dataTestId("createProposalButton"),
    ),
    seeAllProposalDetailsButton: new Button(
      this.ef.pw.dataTestId("seeAll_proposalDetailsButton"),
    ),
    proposalDetailsContent: new Label(
      this.ef.pw.dataTestId("proposalDetailsContent"),
    ),
    seeLessProposalDetailsButton: new Button(
      this.ef.pw.dataTestId("seeLess_proposalDetailsButton"),
    ),
    seeAllExecutionCodeButton: new Button(
      this.ef.pw.dataTestId("seeAll_executionCodeButton"),
    ),
    executionCodeContent: new Label(
      this.ef.pw.dataTestId("executionCodeContent"),
    ),
    seeLessExecutionCodeButton: new Button(
      this.ef.pw.dataTestId("seeLess_executionCodeButton"),
    ),
  };

  confirmProposalPopup = new Label(
    this.ef.pw.text("Please sign the transaction in your wallet"),
  );
  proposalSuccessToast = {
    toast: new Label(this.ef.pw.text("Proposal created successfully!")),
    seeDetailsButton: new Button(this.ef.pw.text("See Details")),
  };

  proposalCreationRejectedByUserToastLabel = new Label(
    this.ef.pw.text("Proposal creation rejected by user"),
  );

  staticElements = [this.headerPageLabel, this.proposalDetailsStage.titleInput];
}
