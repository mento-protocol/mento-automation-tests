import { IGetWebServices } from "@services/types/get-web-services.types";
import { BrowserContext } from "@playwright/test";
import { IWallet } from "@fixtures/common.fixture";

export interface IExecution {
  web?: IGetWebServices;
  context?: BrowserContext;
  wallet?: IWallet;
}

export interface ISuiteArgs {
  name: string;
  tests: ITest[];
  beforeAll?: (params: IExecution) => Promise<void>;
  beforeEach?: (params: IExecution) => Promise<void>;
  afterAll?: (params: IExecution) => Promise<void>;
  afterEach?: (params: IExecution) => Promise<void>;
}

export interface ITest {
  name: string;
  testCaseId: string;
  test: (args: IExecution) => Promise<void>;
  xname?: string;
  fname?: string;
  isNewWebContext?: boolean;
  disable?: IDisable;
}

export interface IDisable {
  reason: string;
  link: string;
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
  disable?: IDisable;
}

export interface IRunTestWithWebArgs extends IRunTestArgs {
  name: string;
  isNewWebContext: boolean;
  testCaseId: string;
}
