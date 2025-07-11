import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { ConnectWalletModalService } from "@shared/web/connect-wallet-modal/connect-wallet-modal.service";
import { ConnectWalletModalPage } from "@shared/web/connect-wallet-modal/connect-wallet-modal.page";
import { MainAppMentoService } from "../../apps/app-mento/web/main/main.service";
import { MainAppMentoPage } from "../../apps/app-mento/web/main/main.page";
import { WalletSettingsPopupService } from "../../apps/app-mento/web/wallet-settings-popup/wallet-settings-popup.service";
import { WalletSettingsPopupPage } from "../../apps/app-mento/web/wallet-settings-popup/wallet-settings-popup.page";
import { NetworkModalService } from "../../apps/app-mento/web/network-modal/network-modal.service";
import { NetworkModalPage } from "../../apps/app-mento/web/network-modal/network-modal.page";
import { SwapService } from "../../apps/app-mento/web/swap/swap.service";
import { SwapPage } from "../../apps/app-mento/web/swap/swap.page";
import { SelectTokenModalPage } from "../../apps/app-mento/web/select-token-modal/select-token-modal.page";
import { SlippageModalPage } from "../../apps/app-mento/web/slippage-modal/slippage-modal.page";
import { ConfirmSwapService } from "../../apps/app-mento/web/confirm-swap/confirm-swap.service";
import { ConfirmSwapPage } from "../../apps/app-mento/web/confirm-swap/confirm-swap.page";
import { MetamaskHelper } from "@helpers/wallet/metamask-wallet.helper";
import { BrowserHelper } from "@helpers/browser/browser.helper";
import { AppName } from "@constants/apps.constants";
import { MainGovernanceService } from "../../apps/governance/web/main/main.service";
import { MainGovernancePage } from "../../apps/governance/web/main/main.page";
import { envHelper } from "@helpers/env/env.helper";
import { HttpClient } from "@shared/api/http/http-client";
import { VotingPowerService } from "../../apps/governance/web/voting-power/voting-power.service";
import { CreateProposalService } from "../../apps/governance/web/create-proposal/create-proposal.service";
import { ProposalViewPage } from "../../apps/governance/web/proposal-view/proposal-view.page";
import { ProposalViewService } from "../../apps/governance/web/proposal-view/proposal-view.service";
import { VotingPowerPage } from "../../apps/governance/web/voting-power/voting-power.page";
import { CreateProposalPage } from "../../apps/governance/web/create-proposal/create-proposal.page";

/**
 * 🚀 Goal
 * The Assembler class creates WEB or API instances via the Factory Pattern for different applications based on the
 * current .env configuration. This approach avoids assembling all application-related instances
 * unnecessarily, improving performance and resource usage.
 *
 * 📦 Dependency Management
 * It manages dependencies and provides a centralized way to access:
 * • Application services and pages for WEB testing
 * • App controllets and HTTP client
 *
 * 🔧 Instantiation & Dependencies
 * The Assembler can be instantiated for either WEB or API testing by passing different dependencies.
 * Its constructor accepts different dependencies through discriminated union types:
 *
 * 🌐 WEB:
 * • elementFinder: ElementFinderHelper
 * • browserHelper: BrowserHelper
 * • metamaskHelper: MetamaskHelper
 *
 * 🔌 API:
 * • httpClient: HttpClient
 */
export class Assembler {
  private readonly appName = envHelper.getApp();

  private readonly elementFinder: ElementFinderHelper = null;
  private readonly browserHelper: BrowserHelper = null;
  private readonly metamaskHelper: MetamaskHelper = null;
  private readonly httpClient: HttpClient = null;

  constructor({
    elementFinder,
    browserHelper,
    metamaskHelper,
    httpClient,
  }: AssemblerDependacies) {
    this.elementFinder = elementFinder;
    this.browserHelper = browserHelper;
    this.metamaskHelper = metamaskHelper;
    this.httpClient = httpClient;
  }

  //❗️ Assembling WEB only for a specified app by 'APP_NAME' variable in .env
  async web(): Promise<IWeb> {
    const baseDependencies: IBaseDependencies = {
      browser: this.browserHelper,
      metamaskHelper: this.metamaskHelper,
    };
    return {
      ...baseDependencies,
      app: this.apps.web[this.appName](this.elementFinder, baseDependencies),
    };
  }

  //❗️ Assembling API only for a specified app by 'APP_NAME' variable in .env
  async api(): Promise<IApi> {
    return {
      httpClient: this.httpClient,
      // TODO: enable app assembling when there're use cases
      // app: this.apps.api[this.appName](this.httpClient),
    };
  }

  private readonly apps = {
    web: {
      [AppName.AppMento]: (
        ef: ElementFinderHelper,
        baseDependencies: IBaseDependencies,
      ) => {
        return {
          appMento: {
            main: new MainAppMentoService({
              page: new MainAppMentoPage(ef),
              ...baseDependencies,
              connectWalletModal: new ConnectWalletModalService({
                page: new ConnectWalletModalPage(ef),
                ...baseDependencies,
              }),
              walletSettingsPopup: new WalletSettingsPopupService({
                page: new WalletSettingsPopupPage(ef),
                ...baseDependencies,
                networkDetails: new NetworkModalService({
                  page: new NetworkModalPage(ef),
                  ...baseDependencies,
                }),
              }),
            }),
            swap: new SwapService({
              page: new SwapPage(ef),
              selectTokenModalPage: new SelectTokenModalPage(ef),
              slippageModalPage: new SlippageModalPage(ef),
              ...baseDependencies,
              confirm: new ConfirmSwapService({
                page: new ConfirmSwapPage(ef),
                ...baseDependencies,
              }),
            }),
          },
        };
      },
      [AppName.Governance]: (
        ef: ElementFinderHelper,
        baseDependencies: IBaseDependencies,
      ) => {
        return {
          governance: {
            main: new MainGovernanceService({
              page: new MainGovernancePage(ef),
              ...baseDependencies,
              connectWalletModal: new ConnectWalletModalService({
                page: new ConnectWalletModalPage(ef),
                ...baseDependencies,
              }),
              createProposalPage: new CreateProposalPage(ef),
            }),
            createProposal: new CreateProposalService({
              page: new CreateProposalPage(ef),
              ...baseDependencies,
            }),
            votingPower: new VotingPowerService({
              page: new VotingPowerPage(ef),
              ...baseDependencies,
            }),
            proposalView: new ProposalViewService({
              page: new ProposalViewPage(ef),
              ...baseDependencies,
            }),
          },
        };
      },
    },
    // TODO: add api apps when there're use cases
    // api: {},
  };
}

export interface IWebAssemblerDependacies {
  elementFinder: ElementFinderHelper;
  browserHelper: BrowserHelper;
  metamaskHelper: MetamaskHelper;

  httpClient?: never;
}

export interface IApiAssemblerDependacies {
  httpClient: HttpClient;

  elementFinder?: never;
  browserHelper?: never;
  metamaskHelper?: never;
}

export type AssemblerDependacies =
  | IWebAssemblerDependacies
  | IApiAssemblerDependacies;

interface IBaseDependencies {
  browser: BrowserHelper;
  metamaskHelper: MetamaskHelper;
}

export interface IWeb {
  browser: BrowserHelper;
  metamaskHelper: MetamaskHelper;
  app: WebApps;
}

export interface IApi {
  httpClient: HttpClient;
  // app: ApiApps;
}

export type WebApps = IAppMentoWebApp | IGovernanceWebApp;

export type ApiApps = Record<string, never>;

export interface IAppMentoWebApp {
  appMento: IAppMentoApp;
  governance?: never;
}

export interface IGovernanceWebApp {
  governance: IGovernanceApp;
  appMento?: never;
}

interface IAppMentoApp {
  main: MainAppMentoService;
  swap: SwapService;
}

interface IGovernanceApp {
  main: MainGovernanceService;
  createProposal: CreateProposalService;
  votingPower: VotingPowerService;
  proposalView: ProposalViewService;
}
