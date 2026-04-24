import type { IApplicationFixtures } from "@fixtures/test.fixture";
import { ChainType, ChainName } from "@helpers/env/env.helper";

export type IExecution = IApplicationFixtures;

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
  retries?: number;
}

export interface ITest {
  name: string;
  testCaseId: string;
  test: (args: IExecution) => Promise<void>;
  disable?: IDisable;
  tags?: string[];
  timeout?: number;
}

export interface IDisable {
  reason: string;
  link?: string;
  env?: string;
  chainType?: ChainType;
  chainName?: ChainName;
}
