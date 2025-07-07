import { Page } from "@playwright/test";

import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { ConnectWalletModalService } from "@shared/web/connect-wallet-modal/connect-wallet-modal.service";
import { ConnectWalletModalPage } from "@shared/web/connect-wallet-modal/connect-wallet-modal.page";
import { MainAppMentoService } from "../../app-mento/web/main/main.service";
import { MainAppMentoPage } from "../../app-mento/web/main/main.page";
import { WalletSettingsPopupService } from "../../app-mento/web/wallet-settings-popup/wallet-settings-popup.service";
import { WalletSettingsPopupPage } from "../../app-mento/web/wallet-settings-popup/wallet-settings-popup.page";
import { NetworkModalService } from "../../app-mento/web/network-modal/network-modal.service";
import { NetworkModalPage } from "../../app-mento/web/network-modal/network-modal.page";
import { SwapService } from "../../app-mento/web/swap/swap.service";
import { SwapPage } from "../../app-mento/web/swap/swap.page";
import { SelectTokenModalPage } from "../../app-mento/web/select-token-modal/select-token-modal.page";
import { SlippageModalPage } from "../../app-mento/web/slippage-modal/slippage-modal.page";
import { ConfirmSwapService } from "../../app-mento/web/confirm-swap/confirm-swap.service";
import { ConfirmSwapPage } from "../../app-mento/web/confirm-swap/confirm-swap.page";
import { MetamaskHelper } from "@helpers/wallet/metamask-wallet.helper";
import { Browser } from "@helpers/browser/browser.helper";
import { AppName } from "@constants/apps.constants";
import { MainGovernanceService } from "../../governance/web/main/main.service";
import { MainGovernancePage } from "../../governance/web/main/main.page";

const apps = {
  [AppName.AppMento]: (
    ef: ElementFinderHelper,
    baseDependencies: IBaseDependencies,
  ) => {
    return {
      ...baseDependencies,
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
    };
  },
  [AppName.Governance]: (
    ef: ElementFinderHelper,
    baseDependencies: IBaseDependencies,
  ) => {
    return {
      ...baseDependencies,
      main: new MainGovernanceService({
        page: new MainGovernancePage(ef),
        ...baseDependencies,
        connectWalletModal: new ConnectWalletModalService({
          page: new ConnectWalletModalPage(ef),
          ...baseDependencies,
        }),
      }),
    };
  },
};

export function assembleWeb({
  pwPage,
  browser,
  metamaskHelper,
}: IAssembleWebArgs): IAssembleWeb {
  const ef = new ElementFinderHelper({ page: pwPage });
  const baseDependencies: IBaseDependencies = { browser, metamaskHelper };
  return apps[AppName.AppMento](ef, baseDependencies);
}

interface IBaseDependencies {
  browser: Browser;
  metamaskHelper: MetamaskHelper;
}

export interface IAssembleWebArgs {
  pwPage: Page;
  browser: Browser;
  metamaskHelper: MetamaskHelper;
}

export interface IAssembleWeb {
  browser: Browser;
  metamaskHelper: MetamaskHelper;
  main: MainAppMentoService;
  swap: SwapService;
}
