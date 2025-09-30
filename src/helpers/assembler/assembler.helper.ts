import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { ConnectWalletModalService } from "@shared/web/connect-wallet-modal/connect-wallet-modal.service";
import { ConnectWalletModalPage } from "@shared/web/connect-wallet-modal/connect-wallet-modal.page";
import { MainAppMentoService } from "../../apps/app-mento/web/main/main.service";
import { MainAppMentoPage } from "../../apps/app-mento/web/main/main.page";
import { SettingsService } from "../../apps/app-mento/web/settings/settings.service";
import { SettingsPage } from "../../apps/app-mento/web/settings/settings.page";
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
import { HttpClient } from "@helpers/api/http/http-client";
import { GraphQLClient } from "@helpers/api/graphql/graphql.client";
import { VotingPowerService } from "../../apps/governance/web/voting-power/voting-power.service";
import { CreateProposalService } from "../../apps/governance/web/create-proposal/create-proposal.service";
import { ProposalViewPage } from "../../apps/governance/web/proposal-view/proposal-view.page";
import { ProposalViewService } from "../../apps/governance/web/proposal-view/proposal-view.service";
import { VotingPowerPage } from "../../apps/governance/web/voting-power/voting-power.page";
import { CreateProposalPage } from "../../apps/governance/web/create-proposal/create-proposal.page";
import { ContractHelper } from "@helpers/contract/contract.helper";
import { CeloScanService } from "@shared/web/celo-scan/celo-scan.service";
import { CeloScanPage } from "@shared/web/celo-scan/celo-scan.page";
import { SwitchNetworksPage } from "../../apps/app-mento/web/settings/switch-networks.page";
import { GovernanceApi } from "../../apps/governance/api/governance.api";

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
export class AssemblerHelper {
  private readonly appName = envHelper.getApp();

  private readonly elementFinder: ElementFinderHelper = null;
  private readonly browserHelper: BrowserHelper = null;
  private readonly metamaskHelper: MetamaskHelper = null;
  private readonly contractHelper: ContractHelper = null;
  private readonly httpClient: HttpClient = null;
  private readonly graphqlClient: GraphQLClient = null;

  constructor({
    elementFinder,
    browserHelper,
    metamaskHelper,
    contractHelper,
    httpClient,
    graphqlClient,
  }: AssemblerDependacies) {
    this.elementFinder = elementFinder;
    this.browserHelper = browserHelper;
    this.metamaskHelper = metamaskHelper;
    this.contractHelper = contractHelper;
    this.httpClient = httpClient;
    this.graphqlClient = graphqlClient;
  }

  //❗️ Assembling WEB only for a specified app by 'APP_NAME' variable in .env
  async web(): Promise<IWeb> {
    const baseDependencies: IBaseWebDependencies = {
      browser: this.browserHelper,
      metamask: this.metamaskHelper,
      contract: this.contractHelper,
      celoScan: new CeloScanService({
        page: new CeloScanPage(this.elementFinder),
        metamask: this.metamaskHelper,
        browser: this.browserHelper,
      }),
    };
    return {
      ...baseDependencies,
      app: this.apps.web[this.appName](this.elementFinder, baseDependencies),
    };
  }

  //❗️ Assembling API only for a specified app by 'APP_NAME' variable in .env
  async api(): Promise<IApi> {
    const baseDependencies: IBaseApiDependencies = {
      httpClient: this.httpClient,
      graphqlClient: this.graphqlClient,
    };
    return {
      ...baseDependencies,
      app: this.apps.api[this.appName](baseDependencies),
    };
  }

  private readonly apps = {
    web: {
      [AppName.AppMento]: (
        ef: ElementFinderHelper,
        baseDependencies: IBaseWebDependencies,
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
              settings: new SettingsService({
                page: new SettingsPage(ef),
                ...baseDependencies,
                switchNetworksPage: new SwitchNetworksPage(ef),
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
        baseDependencies: IBaseWebDependencies,
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
              votingPowerPage: new VotingPowerPage(ef),
              proposalView: new ProposalViewPage(ef),
            }),
            createProposal: new CreateProposalService({
              page: new CreateProposalPage(ef),
              proposalViewPage: new ProposalViewPage(ef),
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
    api: {
      [AppName.Governance]: (params: IBaseApiDependencies) => {
        const { graphqlClient } = params;
        return {
          governance: {
            common: new GovernanceApi(graphqlClient),
          },
        };
      },
    },
  };
}

interface IBaseApiDependencies {
  httpClient: HttpClient;
  graphqlClient: GraphQLClient;
}

export interface IWebAssemblerDependacies {
  elementFinder: ElementFinderHelper;
  browserHelper: BrowserHelper;
  metamaskHelper: MetamaskHelper;
  contractHelper: ContractHelper;

  httpClient?: never;
  graphqlClient?: never;
}

export interface IApiAssemblerDependacies {
  httpClient: HttpClient;
  graphqlClient: GraphQLClient;

  elementFinder?: never;
  browserHelper?: never;
  metamaskHelper?: never;
  contractHelper?: never;
}

export type AssemblerDependacies =
  | IWebAssemblerDependacies
  | IApiAssemblerDependacies;

interface IBaseWebDependencies {
  browser: BrowserHelper;
  metamask: MetamaskHelper;
  contract: ContractHelper;
  celoScan: CeloScanService;
}

export interface IWeb {
  browser: BrowserHelper;
  metamask: MetamaskHelper;
  contract: ContractHelper;
  celoScan: CeloScanService;
  app: WebApps;
}

export interface IApi {
  httpClient: HttpClient;
  graphqlClient: GraphQLClient;
  app: ApiApps;
}

export type WebApps = IAppMentoWebApp | IGovernanceWebApp;

export interface IGovernanceApi {
  common: GovernanceApi;
}

export type ApiApps = {
  governance: IGovernanceApi;
};

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

export interface IGovernanceApp {
  main: MainGovernanceService;
  createProposal: CreateProposalService;
  votingPower: VotingPowerService;
  proposalView: ProposalViewService;
}
