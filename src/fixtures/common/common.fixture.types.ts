import type {
  Page,
  PlaywrightTestArgs,
  PlaywrightTestOptions,
  PlaywrightWorkerArgs,
  PlaywrightWorkerOptions,
  TestType,
} from "@playwright/test";
import { MetaMask } from "@synthetixio/synpress/playwright";

import { IAssmbleApi } from "@api/assemble-api";
import { IAssembleWeb } from "../../application/web/assemble-web.types";
import { MetamaskHelper } from "@helpers/wallet/metamask-wallet.helper";

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
  metamaskHelper: MetamaskHelper;
}

export interface ISynpressFixtures {
  _contextPath: string;
  metamask: MetaMask;
  extensionId: string;
  metamaskPage: Page;
  connectToAnvil: () => Promise<void>;
  deployToken: () => Promise<void>;
  deployAndMintERC1155: () => Promise<void>;
}
