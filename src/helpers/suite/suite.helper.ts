import {
  ConditionFunction,
  IExecution,
  IRunPreConditions,
  IRunTestArgs,
  IRunTestsArgs,
  IRunTestWithoutArgs,
  IRunTestWithWebArgs,
  ISuiteArgs,
} from "@helpers/suite/suite.types";
import { loggerHelper } from "@helpers/logger/logger.helper";
import { envHelper } from "@helpers/env/env.helper";
import { init } from "@helpers/init/init.helper";
import { testFixture } from "@fixtures/common.fixture";

const logger = loggerHelper.get("SuiteHelper");
let executionArgs: IExecution = { web: null, api: null, wallet: null };

export function suite(args: ISuiteArgs): void {
  const {
    name,
    tests,
    beforeAll,
    beforeEach,
    afterEach,
    afterAll,
    shouldInitWeb = true,
  } = args;

  if (!name.length) {
    throw new Error(`Please specify suite name`);
  }

  logger.info(
    `Running '${name}' suite against '${envHelper.getEnv()}' on ${
      process.pid
    } PID`,
  );

  testFixture.describe(name, () => {
    utils.runBeforeAll({
      shouldInitWeb,
      conditionFunction: beforeAll,
    });
    utils.runTests({
      beforeEach,
      afterEach,
      tests,
      shouldInitWeb,
    });
    utils.runAfterAll(afterAll);
  });
}

class Utils {
  runBeforeAll(args: IRunPreConditions): void {
    const { shouldInitWeb, conditionFunction } = args;
    return shouldInitWeb
      ? testFixture.beforeAll(
          async ({ browser, playwright: { request }, wallet }) => {
            executionArgs = {
              web: await init.web(browser),
              api: await init.api(request),
              wallet,
            };
            conditionFunction && (await conditionFunction(executionArgs));
          },
        )
      : testFixture.beforeAll(async ({ playwright: { request } }) => {
          executionArgs = {
            api: await init.api(request),
          };
          conditionFunction && (await conditionFunction(executionArgs));
        });
  }

  runAfterAll(conditionFunction: ConditionFunction): void {
    conditionFunction &&
      testFixture.afterAll(async () => await conditionFunction(executionArgs));
  }

  runTests(args: IRunTestsArgs): void {
    const { beforeEach, afterEach, tests, shouldInitWeb } = args;
    tests.forEach(suiteTest => {
      const {
        test,
        testName,
        isNewWebContext = false,
        isNewApiContext = false,
      } = suiteTest;
      return shouldInitWeb
        ? this.runTestWithWeb({
            test,
            testName,
            isNewWebContext,
            isNewApiContext,
            beforeEach,
            afterEach,
          })
        : this.runTestWithoutWeb({
            test,
            testName,
            isNewApiContext,
            beforeEach,
            afterEach,
          });
    });
  }

  private async runTest(args: IRunTestArgs): Promise<void> {
    const { test, beforeEach, afterEach } = args;
    beforeEach && (await beforeEach(executionArgs));
    await test(executionArgs);
    afterEach && (await afterEach(executionArgs));
  }

  private runTestWithWeb(args: IRunTestWithWebArgs): void {
    const {
      test,
      testName,
      isNewWebContext,
      isNewApiContext,
      beforeEach,
      afterEach,
    } = args;
    testFixture(testName, async ({ browser, playwright: { request } }) => {
      executionArgs = {
        web: isNewWebContext ? await init.web(browser) : executionArgs.web,
        api: isNewApiContext ? await init.api(request) : executionArgs.api,
        wallet: executionArgs.wallet,
      };
      await this.runTest({ test, beforeEach, afterEach });
    });
  }

  private runTestWithoutWeb(args: IRunTestWithoutArgs): void {
    const { test, testName, isNewApiContext, beforeEach, afterEach } = args;
    testFixture(testName, async ({ playwright: { request } }) => {
      executionArgs = {
        api: isNewApiContext ? await init.api(request) : executionArgs.api,
      };
      await this.runTest({ test, beforeEach, afterEach });
    });
  }
}

const utils = new Utils();
