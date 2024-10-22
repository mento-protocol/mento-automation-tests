import { IBaseServiceArgs } from "../base.service";
import { SwapPo } from "../../pageObjects/swap.po";
import { ConfirmSwapPo } from "@web/pageObjects/confirm-swap.po";
import { CeloExplorerPo } from "@web/pageObjects/celo-explorer.po";

export interface ISwapServiceArgs extends IBaseServiceArgs {
  swapPage: SwapPo;
  confirmSwapPage: ConfirmSwapPo;
  celoExplorerPage: CeloExplorerPo;
}
