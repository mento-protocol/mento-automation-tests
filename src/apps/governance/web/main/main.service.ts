import { BaseService, IBaseServiceArgs } from "@shared/web/base/base.service";
import { ClassLog } from "@decorators/logger.decorators";
import {
  ConnectWalletModalService,
  WalletName,
} from "@shared/web/connect-wallet-modal/connect-wallet-modal.service";
import { MainGovernancePage } from "./main.page";
import { CreateProposalPage } from "../create-proposal/create-proposal.page";
import { timeouts } from "@constants/timeouts.constants";
import { waiterHelper } from "@helpers/waiter/waiter.helper";
import { VotingPowerPage } from "../voting-power/voting-power.page";
import { loggerHelper } from "@helpers/logger/logger.helper";
import {
  ProposalState,
  ProposalViewService,
} from "../proposal-view/proposal-view.service";

const log = loggerHelper.get("MainGovernanceService");

@ClassLog
export class MainGovernanceService extends BaseService {
  public override page: MainGovernancePage = null;
  public connectWalletModal: ConnectWalletModalService = null;
  public createProposalPage: CreateProposalPage = null;
  public proposalView: ProposalViewService = null;
  public votingPowerPage: VotingPowerPage = null;

  constructor(args: IMainGovernanceServiceArgs) {
    const {
      page,
      connectWalletModal,
      createProposalPage,
      proposalView,
      votingPowerPage,
    } = args;
    super(args);
    this.page = page;
    this.connectWalletModal = connectWalletModal;
    this.createProposalPage = createProposalPage;
    this.proposalView = proposalView;
    this.votingPowerPage = votingPowerPage;
  }

  async openConnectWalletModal(): Promise<void> {
    await this.page.headerConnectWalletButton.click();
    await this.connectWalletModal.page.verifyIsOpen();
  }

  async connectWalletByName(walletName: WalletName): Promise<void> {
    await this.openConnectWalletModal();
    await this.connectWalletModal.selectWalletByName(walletName);
    await this.metamask.connectWallet();
    await this.waitForWalletToBeConnected();
  }

  async openCreateProposalPage(): Promise<void> {
    await waiterHelper.retry(
      async () => {
        await this.page.createProposalButton.click({ timeout: timeouts.xs });
        await this.createProposalPage.verifyIsOpen();
        return true;
      },
      3,
      {
        errorMessage: "Failed to open create proposal page",
        throwError: true,
        continueWithException: true,
      },
    );
  }

  async openVotingPowerPage(): Promise<void> {
    await this.page.navButtons.votingPower.click();
    await this.votingPowerPage.verifyIsOpen();
  }

  async verifyProposalStateOnPreview({
    verifyOnPreviewProposalState,
    timeout = timeouts.xs,
  }: IVerifyProposalStateOnPreview) {
    switch (verifyOnPreviewProposalState) {
      case ProposalState.Active:
        return this.proposalView.verifyActiveStateOnPreview(timeout);
      case ProposalState.Succeeded:
        return this.proposalView.verifySucceededStateOnPreview(timeout);
      default:
        throw new Error(
          `verifyProposalStateOnPreview: Unsupported state "${verifyOnPreviewProposalState}"`,
        );
    }
  }

  async openProposalByTitle(
    title: string,
    { verifyOnPreviewProposalState, timeout }: IVerifyProposalStateOnPreview,
  ): Promise<void> {
    await this.waitForProposalByTitle(title, timeout);
    await this.page.getProposalByTitle(title).click();
    await this.proposalView.verifyIsOpen();
    if (verifyOnPreviewProposalState) {
      await this.verifyProposalStateOnPreview({ verifyOnPreviewProposalState });
    }
  }

  async openProposalById(
    id: string,
    { verifyOnPreviewProposalState }: IVerifyProposalStateOnPreview,
  ): Promise<void> {
    await this.navigateToAppPage(`/proposals/${id}`);
    await this.proposalView.verifyIsOpen();
    if (verifyOnPreviewProposalState) {
      await this.verifyProposalStateOnPreview({ verifyOnPreviewProposalState });
    }
  }

  async openContractAddressesSection(): Promise<void> {
    await this.page.contractAddressesSection.click();
    await this.page.contractAddresseLinkButtons.governor.waitForDisplayed(
      timeouts.xxs,
      { errorMessage: "Contract addresses section is not opened" },
    );
  }

  async waitForWalletToBeConnected(): Promise<boolean> {
    return this.page.headerConnectWalletButton.waitForDisappeared(timeouts.s, {
      throwError: false,
    });
  }

  async waitForProposalByTitle(
    title: string,
    timeout: number,
  ): Promise<boolean> {
    return waiterHelper.wait(
      async () => {
        await this.browser.refresh();
        const proposal = await this.page.getProposalByTitle(title);
        return proposal.waitForDisplayed(timeouts.xs, { throwError: false });
      },
      timeout,
      {
        errorMessage: `'${title}' proposal hasn't displayed`,
        throwError: false,
        interval: timeouts.xs,
      },
    );
  }

  async isWalletConnected(): Promise<boolean> {
    return !(await this.page.headerConnectWalletButton.isDisplayed());
  }

  async isProposalThereByTitle(title: string): Promise<boolean> {
    return (await this.page.getProposalByTitle(title)).isDisplayed();
  }

  // In case of switching network on start, we need to cancel the tx.
  // Sometimes dApp wants to switch network to default one.
  private async cancelSwitchNetworkTxOnStart(): Promise<void> {
    try {
      await this.metamask.approveNewNetwork();
      await this.metamask.rejectSwitchNetwork();
    } catch (error) {
      log.warn(
        "Failed to approve new network and after rejecting switch network tx",
      );
      log.error(error);
    }
  }
}

interface IVerifyProposalStateOnPreview {
  verifyOnPreviewProposalState: VerifyOnPreviewProposalState;
  timeout?: number;
}

type VerifyOnPreviewProposalState =
  | ProposalState.Active
  | ProposalState.Succeeded;

export interface IMainGovernanceServiceArgs extends IBaseServiceArgs {
  page: MainGovernancePage;
  connectWalletModal: ConnectWalletModalService;
  createProposalPage: CreateProposalPage;
  proposalView: ProposalViewService;
  votingPowerPage: VotingPowerPage;
}
