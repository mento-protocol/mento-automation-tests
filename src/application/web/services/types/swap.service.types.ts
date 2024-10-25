import { SwapPo } from "@pageObjects/swap.po";
import { ConfirmSwapPo } from "@pageObjects/confirm-swap.po";
import { CeloExplorerPo } from "@pageObjects/celo-explorer.po";
import { ConfirmSwapService } from "@services/confirm-swap.service";
import { IBaseServiceArgs } from "@services/types/base.service.types";

export interface ISwapServiceArgs extends IBaseServiceArgs {
  page: SwapPo;
  confirm: ConfirmSwapService;
}

export interface IConfirmSwapServiceArgs extends IBaseServiceArgs {
  page: ConfirmSwapPo;
}

export interface ICeloExplorerServiceArgs extends IBaseServiceArgs {
  page: CeloExplorerPo;
}

export interface ISwapInputs {
  beforeSwapPrice: string;
  afterSwapPrice: string;
}
