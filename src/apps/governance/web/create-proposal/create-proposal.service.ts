import { BaseService, IBaseServiceArgs } from "@shared/web/base/base.service";
import { ClassLog } from "@decorators/logger.decorators";
import { timeouts } from "@constants/timeouts.constants";
import { CreateProposalPage } from "./create-proposal.page";
import { expect } from "@playwright/test";
import { waiterHelper } from "@helpers/waiter/waiter.helper";

const defaultExecutionCode = `[
  {
    "address": "0x0000000000000000000000000000000000000000",
    "value": 0,
    "data": "0x"
  }
]`;

export interface ICreateProposalArgs {
  title?: string;
  description?: string;
  executionCode?: string;
}

export interface ICreateProposalServiceArgs extends IBaseServiceArgs {
  page: CreateProposalPage;
}

@ClassLog
export class CreateProposalService extends BaseService {
  public override page: CreateProposalPage = null;

  constructor(args: ICreateProposalServiceArgs) {
    const { page } = args;
    super(args);
    this.page = page;
  }

  async createValid({
    title = `[${Date.now()}] Automation-Proposal`,
    description = `[${Date.now()}] Automation-Proposal-Description`,
    executionCode = defaultExecutionCode,
  }: ICreateProposalArgs = {}): Promise<void> {
    await this.fillProposalDetails({ title, description });
    await this.page.nextButton.click();
    await this.verifyExecutionCodeStageOpened();
    expect
      .soft(await this.page.executionCodeStage.codeInput.getText())
      .toBe(defaultExecutionCode);
    await this.page.executionCodeStage.codeInput.enterText(executionCode);
    await this.page.nextButton.click();
    await this.verifyReviewStageOpened();
    await this.page.reviewStage.createProposalButton.click();
    await this.verifyCreationPopupAppeared();
    await this.metamaskHelper.confirmTransaction();
    expect
      .soft(
        await this.page.proposalSuccessToast.waitUntilDisplayed(timeouts.s, {
          throwError: false,
        }),
      )
      .toBeTruthy();
    await this.verifyCreationPopupDisappeared();
  }

  async verifyCreationPopupAppeared(): Promise<boolean> {
    return this.page.confirmProposalPopup.waitUntilDisplayed(timeouts.m, {
      errorMessage: "'Confirm proposal' popup is not appeared!",
    });
  }

  async verifyCreationPopupDisappeared(): Promise<boolean> {
    return this.page.confirmProposalPopup.waitUntilDisappeared(timeouts.m, {
      errorMessage: "'Confirm proposal' popup is not disappeared!",
    });
  }

  async verifyReviewStageOpened(): Promise<boolean> {
    return this.page.reviewStage.stageLabel.waitUntilDisplayed(timeouts.s, {
      errorMessage: "'Review' stage is not opened!",
    });
  }

  async verifyExecutionCodeStageOpened(): Promise<boolean> {
    return this.page.executionCodeStage.stageLabel.waitUntilDisplayed(
      timeouts.s,
      {
        errorMessage: "'Execution code' stage is not opened!",
      },
    );
  }

  async fillProposalDetails({
    title,
    description,
  }: ICreateProposalArgs): Promise<void> {
    await this.page.proposalDetailsStage.titleInput.enterText(title);
    await this.fillDescription(description);
    await waiterHelper.waitForAnimation();
  }

  async fillDescription(description: string): Promise<void> {
    await this.page.proposalDetailsStage.descriptionInput.click();
    // TODO: Wrap this into the enterText method of the input element
    await this.browser.enterTextByKeyboard(description);
  }
}
