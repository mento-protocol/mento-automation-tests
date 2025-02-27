import { IAssembleWeb } from "../../application/web/assemble-web.types";
import { IMetamaskHelper } from "@helpers/wallet/metamask-wallet.helper";
import { IAssmbleApi } from "@api/assemble-api";

export interface IExecution {
  web?: IAssembleWeb;
  api?: IAssmbleApi;
  metamaskHelper?: IMetamaskHelper;
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
}

export interface ITest {
  name: string;
  testCaseId: string;
  test: (args: IExecution) => Promise<void>;
  disable?: IDisable;
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
