import type {
  Page,
  PlaywrightTestArgs,
  PlaywrightTestOptions,
  PlaywrightWorkerArgs,
  PlaywrightWorkerOptions,
  TestType,
} from "@playwright/test";
import { MetaMask } from "@synthetixio/synpress/playwright";

import { IMetamaskHelper } from "@helpers/wallet/metamask-wallet.helper";
import { IAssmbleApi } from "@api/assemble-api";
import { IAssembleWeb } from "../../application/web/assemble-web.types";

export type CommonFixture<IYourFixtures> = TestType<
  PlaywrightTestArgs & PlaywrightTestOptions & IYourFixtures,
  PlaywrightWorkerArgs & PlaywrightWorkerOptions & object
>;

export interface ITestFixtures
  extends IApplicationFixtures,
    ISynpressFixtures {}

export interface IApplicationFixtures {
  web: IAssembleWeb;
  api: IAssmbleApi;
  metamaskHelper: IMetamaskHelper;
}

export interface ISynpressFixtures {
  _contextPath: string;
  metamask: MetaMask;
  extensionId: string;
  metamaskPage: Page;
  connectToAnvil: () => Promise<void>;
  deployToken: () => Promise<void>;
  deployAndMintERC1155: () => Promise<void>;
  // todo: Missing type
  // createAnvilNode: (
  //   options?: CreateAnvilOptions,
  // ) => Promise<{ anvil: Anvil; rpcUrl: string; chainId: number }>;
}
