import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import {
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
  ConnectWalletModalService,
  WalletSettingsPopupService,
  NetworkDetailsModalService,
} from "@services/index";
import { IAssembleWeb, IAssembleWebArgs } from "./assemble-web.types";
import { SelectTokenModalPo } from "@page-objects/select-token-modal/select-token-modal.po";
import { SlippageModalPo } from "@page-objects/slippage-modal/slippage-modal.po";

export function assembleWeb({
  pwPage,
  browser,
  metamaskHelper,
}: IAssembleWebArgs): IAssembleWeb {
  const ef = new ElementFinderHelper({ page: pwPage });
  const baseDependencies = { browser, metamaskHelper };
  return {
    ...baseDependencies,
    main: new MainService({
      page: new MainPo(ef),
      ...baseDependencies,
      connectWalletModal: new ConnectWalletModalService({
        page: new ConnectWalletModalPo(ef),
        ...baseDependencies,
      }),
      walletSettingsPopup: new WalletSettingsPopupService({
        page: new WalletSettingsPopupPo(ef),
        ...baseDependencies,
        networkDetails: new NetworkDetailsModalService({
          page: new NetworkDetailsModalPo(ef),
          ...baseDependencies,
        }),
      }),
      networkDetailsModal: new NetworkDetailsModalService({
        page: new NetworkDetailsModalPo(ef),
        ...baseDependencies,
      }),
    }),
    swap: new SwapService({
      page: new SwapPo(ef),
      selectTokenModalPage: new SelectTokenModalPo(ef),
      slippageModalPage: new SlippageModalPo(ef),
      ...baseDependencies,
      confirm: new ConfirmSwapService({
        page: new ConfirmSwapPo(ef),
        ...baseDependencies,
      }),
    }),
  };
}
