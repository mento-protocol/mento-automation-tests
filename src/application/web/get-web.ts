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

export function getWeb(args: IGetServicesArgs): IGetWebServices {
  const { pwPage, browser } = args;
  const ef = new ElementFinderHelper({ page: pwPage });
  return {
    main: new MainService({
      page: new MainPo(ef),
      browser,
    }),
    swap: new SwapService({
      page: new SwapPo(ef),
      confirm: new ConfirmSwapService({
        page: new ConfirmSwapPo(ef),
        browser,
      }),
      browser,
    }),
    celoExplorer: new CeloExplorerService({
      page: new CeloExplorerPo(ef),
      browser,
    }),
  };
}
