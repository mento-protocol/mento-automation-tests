import { BrowserContext } from "@playwright/test";
import { Dappwright } from "@tenkeylabs/dappwright";

import { MetamaskWalletHelper } from "@helpers/wallet/metamask-wallet.helper";
import { IGetWebServices } from "../../application/web/get-web.types";
import { IGetApi } from "@api/get-api";

export interface IWallet {
  metamask: Dappwright;
  helper: MetamaskWalletHelper;
}

export type MyFixtures = {
  web: IGetWebServices;
  api: IGetApi;
  context: BrowserContext;
  wallet: IWallet;
};
