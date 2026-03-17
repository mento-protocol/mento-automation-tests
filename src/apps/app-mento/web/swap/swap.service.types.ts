import { Token } from "@constants/token.constants";
import { MetamaskHelper } from "@helpers/wallet/metamask-wallet.helper";
import { SelectTokenModalPage } from "../select-token-modal/select-token-modal.page";
import { SlippageModalPage } from "../slippage-modal/slippage-modal.page";
import { IBaseServiceArgs } from "@shared/web/base/base.service";
import { ConfirmSwapService } from "../confirm-swap/confirm-swap.service";
import { SwapPage } from "./swap.page";

export interface ISwapServiceArgs extends IBaseServiceArgs {
  page: SwapPage;
  confirm: ConfirmSwapService;
  selectTokenModalPage: SelectTokenModalPage;
  slippageModalPage: SlippageModalPage;
  metamask: MetamaskHelper;
}

export interface ISwapInputs {
  beforeSwapRate: string;
  afterSwapRate: string;
}

export interface ISwapInputsParams {
  shouldReturnRates?: boolean;
  clicksOnButton?: number;
}

export interface IWaitForLoadedRateParams {
  timeout?: number;
  throwError?: boolean;
}

export enum AmountType {
  Sell = "Sell",
  Buy = "Buy",
}

export interface IFillFromOpts {
  sellAmount?: string;
  tokens?: ISelectTokensArgs;
  slippage?: string;
  clicksOnSellTokenButton?: number;
  waitForLoadedRate?: boolean;
  isSellTokenFirst?: boolean;
}

export interface ISelectTokensArgs {
  sell?: Token;
  buy?: Token;
  clicksOnSellTokenButton?: number;
  isSellTokenFirst?: boolean;
}
