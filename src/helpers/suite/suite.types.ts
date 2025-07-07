import { IAssmbleApi } from "../../apps/shared/api/assemble-api";
import { IAssembleWeb } from "../../apps/shared/web/assemble-web";
import { MetamaskHelper } from "@helpers/wallet/metamask-wallet.helper";

export interface IExecution {
  web?: IAssembleWeb;
  api?: IAssmbleApi;
  metamaskHelper?: MetamaskHelper;
}

export interface ISuiteArgs {
  name: string;
  tests: ITest[];
  beforeEach?: (params: IExecution) => Promise<void>;
  afterEach?: (params: IExecution) => Promise<void>;
  // Only API is available because web inits in beforeEach per each test
  beforeAll?: (params: Pick<IExecution, "api">) => Promise<void>;
  // Only API is available because web inits in beforeEach per each test
  afterAll?: (params: Pick<IExecution, "api">) => Promise<void>;
  tags?: string[];
}

export interface ITest {
  name: string;
  testCaseId: string;
  test: (args: IExecution) => Promise<void>;
  disable?: IDisable;
  tags?: string[];
}

export interface IDisable {
  reason: string;
  link?: string;
  env?: string;
}

export type ConditionFunction = (executionArgs: IExecution) => Promise<void>;

export interface IRunTestsArgs {
  beforeEach: ConditionFunction;
  afterEach: ConditionFunction;
  tests: ITest[];
}

export interface IRunTestArgs {
  test: ConditionFunction;
  beforeEach: ConditionFunction;
  afterEach: ConditionFunction;
}

export interface IRunTestWithWebArgs extends IRunTestArgs {
  name: string;
  isNewWebContext: boolean;
  testCaseId: string;
  disable?: IDisable;
}
