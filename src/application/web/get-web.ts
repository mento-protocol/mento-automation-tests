import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import {
  CeloExplorerPo,
  ConfirmSwapPo,
  ConnectWalletModalPo,
  MainPo,
  NetworkDetailsModalPo,
  SwapPo,
  WalletSettingsPopupPo,
} from "@page-objects/index";
import {
  SwapService,
  MainService,
  ConfirmSwapService,
  CeloExplorerService,
  ConnectWalletModalService,
  WalletSettingsPopupService,
  NetworkDetailsModalService,
} from "@services/index";
import { IGetServicesArgs, IGetWebServices } from "./get-web.types";

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
      networkDetailsModal: new NetworkDetailsModalService({
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
