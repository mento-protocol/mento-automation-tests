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
  metamaskHelper: MetamaskHelper;
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
  buyAmount?: string;
  tokens?: ISelectTokensArgs;
  slippage?: Slippage;
  clicksOnSellTokenButton?: number;
  waitForLoadedRate?: boolean;
  isSellTokenFirst?: boolean;
}

export enum Slippage {
  "0.5%" = "0.5%",
  "1.0%" = "1.0%",
  "1.5%" = "1.5%",
}

export interface ISelectTokensArgs {
  sell?: Token;
  buy?: Token;
  clicksOnSellTokenButton?: number;
  isSellTokenFirst?: boolean;
}
