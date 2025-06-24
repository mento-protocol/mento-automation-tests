import { SwapPo } from "@page-objects/index";
import { ConfirmSwapService, IBaseServiceArgs } from "@services/index";
import { Token } from "@constants/token.constants";
import { MetamaskHelper } from "@helpers/wallet/metamask-wallet.helper";
import { SelectTokenModalPo } from "@page-objects/select-token-modal/select-token-modal.po";
import { SlippageModalPo } from "@page-objects/slippage-modal/slippage-modal.po";

export interface ISwapService {
  start: () => Promise<void>;
  selectTokens: (args: ISelectTokensArgs) => Promise<void>;
  chooseSlippage: (slippage: Slippage) => Promise<void>;
  fillForm: (args: IFillFromOpts) => Promise<void>;
  proceedToConfirmation: () => Promise<void>;
  swapInputs: () => Promise<ISwapInputs>;
  getRate: (waitTimeout?: number) => Promise<string>;
  getCurrentToTokenName: () => Promise<string>;
  getCurrentFromTokenName: () => Promise<string>;
  getAmountByType: (amountType: AmountType) => Promise<string>;
  isContinueButtonThere: () => Promise<boolean>;
  isAmountRequiredValidationThere: () => Promise<boolean>;
  isAmountExceedValidationThere: () => Promise<boolean>;
  isAmountTooSmallValidationThere: () => Promise<boolean>;
  isRateThere: () => Promise<boolean>;
  isConsiderKeepNotificationThere: () => Promise<boolean>;
  isFromInputEmpty: () => Promise<boolean>;
  isErrorValidationThere: () => Promise<boolean>;
  isContinueButtonEnabled: () => Promise<boolean>;
  waitForExceedsTradingLimitsValidation: (timeout: number) => Promise<boolean>;
  verifyNoValidMedianCase: () => Promise<void>;
}

export interface ISwapServiceArgs extends IBaseServiceArgs {
  page: SwapPo;
  confirm: ConfirmSwapService;
  selectTokenModalPage: SelectTokenModalPo;
  slippageModalPage: SlippageModalPo;
  metamaskHelper: MetamaskHelper;
}

export interface ISwapInputs {
  beforeSwapRate: string;
  afterSwapRate: string;
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
}
