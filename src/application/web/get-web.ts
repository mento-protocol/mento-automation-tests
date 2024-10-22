import {
  IGetServicesArgs,
  IGetWebServices,
} from "./services/types/get-web-services.types";
import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { MainService } from "./services/main.service";
import { MainPo } from "./pageObjects/main.po";
import { SwapService } from "./services/swap.service";
import { SwapPo } from "./pageObjects/swap.po";
import { ConfirmSwapPo } from "@web/pageObjects/confirm-swap.po";
import { CeloExplorerPo } from "@web/pageObjects/celo-explorer.po";

export function getWeb(args: IGetServicesArgs): IGetWebServices {
  const { pwPage, browser } = args;
  const ef = new ElementFinderHelper({ page: pwPage });
  return {
    main: new MainService({
      page: new MainPo(ef),
      browser,
    }),
    swap: new SwapService({
      swapPage: new SwapPo(ef),
      confirmSwapPage: new ConfirmSwapPo(ef),
      celoExplorerPage: new CeloExplorerPo(ef),
      browser,
    }),
  };
}
