import { BaseService, IBaseServiceArgs } from "@shared/web/base/base.service";
import { ClassLog } from "@decorators/logger.decorators";
import { timeouts } from "@constants/timeouts.constants";
import { CreateProposalPage } from "./create-proposal.page";
import { waiterHelper } from "@helpers/waiter/waiter.helper";
import { ProposalViewPage } from "../proposal-view/proposal-view.page";
import { expect } from "@fixtures/test.fixture";

@ClassLog
export class CreateProposalService extends BaseService {
  public override page: CreateProposalPage = null;
  public proposalViewPage: ProposalViewPage = null;

  private readonly defaultExecutionCode = [
    {
      address: "0x0000000000000000000000000000000000000000",
      value: 0,
      data: "0x",
    },
  ];

  constructor(args: ICreateProposalServiceArgs) {
    const { page, proposalViewPage } = args;
    super(args);
    this.page = page;
    this.proposalViewPage = proposalViewPage;
  }

  async createValid({
    title = `[${Date.now()}] Automation-Proposal`,
    description = `[${Date.now()}] Automation-Proposal-Description`,
    executionCode = this.defaultExecutionCode,
    shouldCheckDetails = true,
  }: ICreateProposalArgs = {}): Promise<void> {
    await this.passProposalDetailsStage({ title, description });
    await this.passExecutionCodeStage({ executionCode, shouldCheckDetails });
    await this.passReviewStage({
      title,
      description,
      executionCode,
      shouldCheckDetails,
    });
  }

  async passReviewStage({
    title,
    description,
    executionCode,
    shouldCheckDetails,
  }: ICreateProposalArgs): Promise<void> {
    if (shouldCheckDetails) {
      await this.expectProposalDetailsOnReview({
        title,
        description,
        executionCode,
      });
    }
    await this.page.reviewStage.createProposalButton.click();
    await this.verifyCreationPopupAppeared();
    await this.metamask.confirmTransaction();
    await this.verifyProposalCreation();
  }

  async verifyProposalCreation(): Promise<void> {
    expect
      .soft(
        await this.page.proposalSuccessToast.waitUntilDisplayed(timeouts.s, {
          throwError: false,
        }),
      )
      .toBeTruthy();
    await this.verifyCreationPopupDisappeared();
    await this.page.verifyIsClosed();
    await this.proposalViewPage.verifyIsOpen();
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

  async passProposalDetailsStage({
    title,
    description,
  }: ICreateProposalArgs): Promise<void> {
    await this.page.proposalDetailsStage.titleInput.enterText(title);
    await this.fillDescription(description);
    await waiterHelper.waitForAnimation();
    await this.page.nextButton.click();
    await this.verifyExecutionCodeStageOpened();
  }

  async fillDescription(description: string): Promise<void> {
    await this.page.proposalDetailsStage.descriptionInput.click();
    // TODO: Wrap this into the enterText method of the input element
    await this.browser.enterTextByKeyboard(description);
  }

  async passExecutionCodeStage({
    executionCode,
    shouldCheckDetails,
  }: ICreateProposalArgs): Promise<void> {
    if (shouldCheckDetails) {
      expect
        .soft(await this.getDefaultExecutionCodeFromItsStage())
        .toEqual(this.defaultExecutionCode);
    }
    await this.page.executionCodeStage.codeInput.enterText(
      JSON.stringify(executionCode),
    );
    await this.page.nextButton.click();
    await this.verifyReviewStageOpened();
  }

  async expectProposalDetailsOnReview({
    title,
    description,
    executionCode,
  }: ICreateProposalArgs): Promise<void> {
    expect.soft(await this.page.reviewStage.stageLabel.getText()).toBe(title);
    expect
      .soft(await this.getProposalDetailsFromReviewStage())
      .toEqual(description);
    expect
      .soft(await this.getExecutionCodeFromReviewStage())
      .toEqual(executionCode);
  }

  async getProposalDetailsFromReviewStage(): Promise<string> {
    if (await this.page.reviewStage.seeAllProposalDetailsButton.isDisplayed()) {
      await this.page.reviewStage.seeAllProposalDetailsButton.click();
    }
    return await this.page.reviewStage.proposalDetailsContent.getText();
  }

  async getExecutionCodeFromReviewStage(): Promise<Record<string, unknown>[]> {
    if (await this.page.reviewStage.seeAllExecutionCodeButton.isDisplayed()) {
      await this.page.reviewStage.seeAllExecutionCodeButton.click();
    }
    return JSON.parse(
      await this.page.reviewStage.executionCodeContent.getText(),
    );
  }

  async getDefaultExecutionCodeFromItsStage(): Promise<
    Record<string, unknown>[]
  > {
    return JSON.parse(await this.page.executionCodeStage.codeInput.getText());
  }
}

export interface ICreateProposalArgs {
  title?: string;
  description?: string;
  executionCode?: Record<string, unknown>[];
  shouldCheckDetails?: boolean;
}

export interface ICreateProposalServiceArgs extends IBaseServiceArgs {
  page: CreateProposalPage;
  proposalViewPage: ProposalViewPage;
}
