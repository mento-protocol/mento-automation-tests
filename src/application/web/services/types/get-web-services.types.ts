import { Page } from "@playwright/test";
import { Browser } from "@helpers/browser/browser.helper";
import { MainService } from "../main.service";
import { SwapService } from "../swap.service";
import { Token } from "@constants/token.constants";
import { CeloExplorerService } from "@services/celo-explorer.service";

export interface IGetServicesArgs {
  pwPage: Page;
  browser: Browser;
}

export interface IGetWebServices {
  main: MainService;
  swap: SwapService;
  celoExplorer: CeloExplorerService;
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
