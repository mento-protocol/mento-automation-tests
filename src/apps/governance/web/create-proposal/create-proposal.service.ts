import { BaseService, IBaseServiceArgs } from "@shared/web/base/base.service";
import { ClassLog } from "@decorators/logger.decorators";
import { timeouts } from "@constants/timeouts.constants";
import { CreateProposalPage } from "./create-proposal.page";
import { ProposalViewPage } from "../proposal-view/proposal-view.page";
import { expect } from "@fixtures/test.fixture";
import { waiterHelper } from "@helpers/waiter/waiter.helper";

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

  async create({
    title = `[${Date.now()}] Automation-Proposal`,
    descriptionDetails = {
      text: `[${Date.now()}] Automation-Proposal-Description`,
      markdownOptionFormat: "Quote",
    },
    executionCode = this.defaultExecutionCode,
    shouldCheckDetails = true,
    shouldReturnTxUrl = false,
  }: ICreateProposalArgs = {}): Promise<string> {
    await this.passProposalDetailsStage({ title, descriptionDetails });
    await this.passExecutionCodeStage({ executionCode, shouldCheckDetails });
    return await this.passReviewStage({
      title,
      descriptionDetails,
      executionCode,
      shouldCheckDetails,
      shouldReturnTxUrl,
    });
  }

  async passReviewStage({
    title,
    descriptionDetails,
    executionCode,
    shouldCheckDetails,
    shouldReturnTxUrl,
  }: ICreateProposalArgs): Promise<string> {
    if (shouldCheckDetails) {
      await this.expectProposalDetailsOnReview({
        title,
        descriptionDetails,
        executionCode,
      });
    }

    await this.page.reviewStage.createProposalButton.click();
    await this.verifyCreationPopupAppeared();
    await this.metamask.confirmTransaction();
    await this.verifyProposalCreation();

    if (shouldReturnTxUrl) {
      return await this.page.proposalSuccessToast.seeDetailsButton.getAttribute(
        "href",
      );
    }
  }

  async verifyProposalCreation(): Promise<void> {
    await this.verifyCreationPopupDisappeared();
    expect
      .soft(
        await this.page.proposalSuccessToast.toast.waitForDisplayed(
          timeouts.xxl,
          {
            throwError: false,
          },
        ),
      )
      .toBeTruthy();
    await this.page.verifyIsClosed();
    await this.proposalViewPage.verifyIsOpen();
  }

  async verifyCreationPopupAppeared(): Promise<boolean> {
    return this.page.confirmProposalPopup.waitForDisplayed(timeouts.m, {
      errorMessage: "'Confirm proposal' popup is not appeared!",
    });
  }

  async verifyCreationPopupDisappeared(): Promise<boolean> {
    // TODO: Replace with xxl timeout when performance issues are resolved
    const timeout = timeouts.minute * 10;
    return this.page.confirmProposalPopup.waitForDisappeared(timeout, {
      errorMessage: "'Confirm proposal' popup is not disappeared!",
    });
  }

  async verifyReviewStageOpened(): Promise<boolean> {
    return this.page.reviewStage.stageLabel.waitForDisplayed(timeouts.s, {
      errorMessage: "'Review' stage is not opened!",
    });
  }

  async verifyExecutionCodeStageOpened(): Promise<boolean> {
    return this.page.executionCodeStage.stageLabel.waitForDisplayed(
      timeouts.s,
      {
        errorMessage: "'Execution code' stage is not opened!",
      },
    );
  }

  async passProposalDetailsStage({
    title,
    descriptionDetails,
  }: ICreateProposalArgs): Promise<void> {
    await this.page.proposalDetailsStage.titleInput.enterText(title);
    await this.fillDescription(descriptionDetails);
    await this.page.nextButton.click();
    await this.verifyExecutionCodeStageOpened();
  }

  async fillDescription({
    text,
    markdownOptionFormat,
  }: {
    text: string;
    markdownOptionFormat?: string;
  }): Promise<void> {
    if (markdownOptionFormat) {
      await this.useMarkdownOptionFormat(markdownOptionFormat);
    }
    // TODO: Wrap this into the enterText method of the input element
    await this.browser.enterTextByKeyboard(text);
  }

  async useMarkdownOptionFormat(markdownOptionFormat: string): Promise<void> {
    await this.page.proposalDetailsStage.descriptionInput.click();
    await this.browser.enterTextByKeyboard(`/${markdownOptionFormat}`);
    await waiterHelper.sleep(timeouts.xxs, {
      sleepReason: "Waiting for markdown option format to be applied!",
    });
    await this.page.proposalDetailsStage.descriptionInput.click();
    await this.browser.pressButton("Enter");
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
    descriptionDetails,
    executionCode,
  }: ICreateProposalArgs): Promise<void> {
    expect.soft(await this.page.reviewStage.stageLabel.getText()).toBe(title);
    expect
      .soft(await this.getProposalDetailsFromReviewStage())
      .toContain(descriptionDetails.text);
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

interface ICreateProposalArgs {
  title?: string;
  descriptionDetails?: {
    text: string;
    markdownOptionFormat?: string;
  };
  executionCode?: Array<Record<string, unknown>>;
  shouldCheckDetails?: boolean;
  shouldReturnTxUrl?: boolean;
}

export interface ICreateProposalServiceArgs extends IBaseServiceArgs {
  page: CreateProposalPage;
  proposalViewPage: ProposalViewPage;
}
