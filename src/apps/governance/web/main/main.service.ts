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

@ClassLog
export class MainGovernanceService extends BaseService {
  public override page: MainGovernancePage = null;
  public connectWalletModal: ConnectWalletModalService = null;
  public createProposalPage: CreateProposalPage = null;

  constructor(args: IMainGovernanceServiceArgs) {
    const { page, connectWalletModal, createProposalPage } = args;
    super(args);
    this.page = page;
    this.connectWalletModal = connectWalletModal;
    this.createProposalPage = createProposalPage;
  }

  async openConnectWalletModal(): Promise<void> {
    await this.page.headerConnectWalletButton.click();
    await this.connectWalletModal.page.verifyIsOpen();
  }

  async connectWalletByName(walletName: WalletName): Promise<void> {
    await this.openConnectWalletModal();
    await this.connectWalletModal.selectWalletByName(walletName);
    await this.metamaskHelper.connectWallet();
    if (!envHelper.isMainnet()) {
      await this.metamaskHelper.approveNewNetwork();
      await this.metamaskHelper.rejectSwitchNetwork();
    }
    await this.waitForWalletToBeConnected();
  }

  async openCreateProposalPage(): Promise<void> {
    await this.page.createProposalButton.click();
    await this.createProposalPage.verifyIsOpen();
  }

  async waitForWalletToBeConnected(): Promise<boolean> {
    return this.page.headerConnectWalletButton.waitUntilDisappeared(
      timeouts.s,
      {
        throwError: false,
      },
    );
  }

  async isWalletConnected(): Promise<boolean> {
    return !(await this.page.headerConnectWalletButton.isDisplayed());
  }
}

export interface IMainGovernanceServiceArgs extends IBaseServiceArgs {
  page: MainGovernancePage;
  connectWalletModal: ConnectWalletModalService;
  createProposalPage: CreateProposalPage;
}
