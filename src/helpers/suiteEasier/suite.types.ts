import { IGetWebServices } from "@web/services/types/get-web-services.types";
import { IGetApi } from "@api/get-api";
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
  testName: string;
  xname?: string;
  fname?: string;
  test: (args: IExecution) => Promise<void>;
  isNewWebContext?: boolean;
}

export interface IRunPreConditions {
  conditionFunction: ConditionFunction;
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
  testName: string;
  isNewWebContext: boolean;
}
