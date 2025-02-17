import { SwapPo } from "@page-objects/index";
import { ConfirmSwapService, IBaseServiceArgs } from "@services/index";
import { Token } from "@constants/token.constants";
import { IMetamaskHelper } from "@helpers/wallet/metamask-wallet.helper";

export interface ISwapService {
  start: () => Promise<void>;
  selectTokens: (args: ISelectTokensArgs) => Promise<void>;
  chooseSlippage: (slippage: Slippage) => Promise<void>;
  fillForm: (args: IFillFromOpts) => Promise<void>;
  continueToConfirmation: () => Promise<void>;
  swapInputs: () => Promise<ISwapInputs>;
  getCurrentPriceFromSwap: (waitTimeout?: number) => Promise<string>;
  getCurrentToTokenName: () => Promise<string>;
  getCurrentFromTokenName: () => Promise<string>;
  getAmountByType: (amountType: AmountType) => Promise<string>;
  isContinueButtonThere: () => Promise<boolean>;
  isAmountRequiredValidationThere: () => Promise<boolean>;
  isAmountExceedValidationThere: () => Promise<boolean>;
  isAmountTooSmallValidationThere: () => Promise<boolean>;
  isCurrentPriceThere: () => Promise<boolean>;
  isConsiderKeepNotificationThere: () => Promise<boolean>;
  isFromInputEmpty: () => Promise<boolean>;
  isErrorValidationThere: () => Promise<boolean>;
  waitForExceedsTradingLimitsValidation: (timeout: number) => Promise<boolean>;
  verifyNoValidMedianCase: () => Promise<void>;
}

export interface ISwapServiceArgs extends IBaseServiceArgs {
  page: SwapPo;
  confirm: ConfirmSwapService;
  metamaskHelper: IMetamaskHelper;
}

export interface ISwapInputs {
  beforeSwapPrice: string;
  afterSwapPrice: string;
}

export enum AmountType {
  In = "In",
  Out = "Out",
}

export interface IFillFromOpts {
  fromAmount?: string;
  toAmount?: string;
  tokens?: ISelectTokensArgs;
  slippage?: Slippage;
}

export enum Slippage {
  "0.5%" = "0.5%",
  "1.0%" = "1.0%",
  "1.5%" = "1.5%",
}

export interface ISelectTokensArgs {
  from?: Token;
  to?: Token;
}
