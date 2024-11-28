import {
  IGetServicesArgs,
  IGetWebServices,
} from "@services/types/get-web-services.types";
import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { MainService } from "@services/main.service";
import { MainPo } from "@pageObjects/main.po";
import { SwapService } from "@services/swap.service";
import { SwapPo } from "@pageObjects/swap.po";
import { ConfirmSwapPo } from "@pageObjects/confirm-swap.po";
import { CeloExplorerPo } from "@pageObjects/celo-explorer.po";
import { ConfirmSwapService } from "@services/confirm-swap.service";
import { CeloExplorerService } from "@services/celo-explorer.service";
import { ConnectWalletModalService } from "@services/connect-wallet-modal.service";
import { ConnectWalletModalPo } from "@pageObjects/connect-wallet-modal.po";
import { WalletSettingsPopupService } from "@services/wallet-settings-popup.service";
import { WalletSettingsPopupPo } from "@pageObjects/wallet-settings-popup.po";
import { NetworkDetailsModalService } from "@services/network-details-modal.service";
import { NetworkDetailsModalPo } from "@pageObjects/network-details-modal.po";

export function getWeb(args: IGetServicesArgs): IGetWebServices {
  const { pwPage, browser } = args;
  const ef = new ElementFinderHelper({ page: pwPage });
  return {
    main: new MainService({
      page: new MainPo(ef),
      browser,
      connectWalletModal: new ConnectWalletModalService({
        page: new ConnectWalletModalPo(ef),
        browser,
      }),
      walletSettingsPopup: new WalletSettingsPopupService({
        page: new WalletSettingsPopupPo(ef),
        browser,
        networkDetails: new NetworkDetailsModalService({
          page: new NetworkDetailsModalPo(ef),
          browser,
        }),
      }),
      networkDetails: new NetworkDetailsModalService({
        page: new NetworkDetailsModalPo(ef),
        browser,
      }),
    }),
    swap: new SwapService({
      page: new SwapPo(ef),
      browser,
      confirm: new ConfirmSwapService({
        page: new ConfirmSwapPo(ef),
        browser,
      }),
    }),
    celoExplorer: new CeloExplorerService({
      page: new CeloExplorerPo(ef),
      browser,
    }),
  };
}
