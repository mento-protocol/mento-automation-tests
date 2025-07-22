import { BaseService, IBaseServiceArgs } from "@shared/web/base/base.service";
import { ClassLog } from "@decorators/logger.decorators";
import {
  ConnectWalletModalService,
  WalletName,
} from "@shared/web/connect-wallet-modal/connect-wallet-modal.service";
import { MainGovernancePage } from "./main.page";
import { envHelper } from "@helpers/env/env.helper";
import { CreateProposalPage } from "../create-proposal/create-proposal.page";
import { timeouts } from "@constants/timeouts.constants";
import { ProposalViewPage } from "../proposal-view/proposal-view.page";
import { waiterHelper } from "@helpers/waiter/waiter.helper";
import { VotingPowerPage } from "../voting-power/voting-power.page";

@ClassLog
export class MainGovernanceService extends BaseService {
  public override page: MainGovernancePage = null;
  public connectWalletModal: ConnectWalletModalService = null;
  public createProposalPage: CreateProposalPage = null;
  public proposalView: ProposalViewPage = null;
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
    if (!envHelper.isMainnet()) {
      await this.metamask.approveNewNetwork();
      await this.metamask.rejectSwitchNetwork();
    }
    await this.waitForWalletToBeConnected();
  }

  async openCreateProposalPage(): Promise<void> {
    await this.page.createProposalButton.click();
    await this.createProposalPage.verifyIsOpen();
  }

  async openVotingPowerPage(): Promise<void> {
    await this.page.navButtons.votingPower.click();
    await this.votingPowerPage.verifyIsOpen();
  }

  async openProposalByTitle(title: string): Promise<void> {
    await this.waitForProposalByTitle(title);
    await (await this.page.getProposalByTitle(title)).click();
    await this.proposalView.verifyIsOpen();
  }

  async waitForWalletToBeConnected(): Promise<boolean> {
    return this.page.headerConnectWalletButton.waitUntilDisappeared(
      timeouts.s,
      {
        throwError: false,
      },
    );
  }

  async waitForProposalByTitle(title: string): Promise<boolean> {
    return waiterHelper.retry(
      async () => {
        await this.browser.refresh();
        return (await this.page.getProposalByTitle(title)).waitUntilDisplayed(
          timeouts.xs,
          { throwError: false },
        );
      },
      5,
      {
        errorMessage: `'${title}' proposal hasn't displayed`,
      },
    );
  }

  async isWalletConnected(): Promise<boolean> {
    return !(await this.page.headerConnectWalletButton.isDisplayed());
  }

  async isProposalThereByTitle(title: string): Promise<boolean> {
    return (await this.page.getProposalByTitle(title)).isDisplayed();
  }
}

export interface IMainGovernanceServiceArgs extends IBaseServiceArgs {
  page: MainGovernancePage;
  connectWalletModal: ConnectWalletModalService;
  createProposalPage: CreateProposalPage;
  proposalView: ProposalViewPage;
  votingPowerPage: VotingPowerPage;
}
