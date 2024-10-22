import {
  ConditionFunction,
  IExecution,
  IRunPreConditions,
  IRunTestArgs,
  IRunTestsArgs,
  IRunTestWithWebArgs,
  ISuiteArgs,
} from "@helpers/suiteEasier/suite.types";
import { loggerHelper } from "@helpers/logger/logger.helper";
import { envHelper } from "@helpers/env/env.helper";
import { init } from "@helpers/init/init.helper";
import { testFixture } from "@fixtures/common.fixture";

const logger = loggerHelper.get("SuiteHelper");
let executionArgs: IExecution = { web: null, wallet: null };

export function suiteEasier(args: ISuiteArgs): void {
  const { name, tests, beforeAll, beforeEach, afterEach, afterAll } = args;

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
      conditionFunction: beforeAll,
    });
    utils.runTests({
      beforeEach,
      afterEach,
      tests,
    });
    utils.runAfterAll(afterAll);
  });
}

class Utils {
  runBeforeAll(args: IRunPreConditions): void {
    const { conditionFunction } = args;
    return testFixture.beforeAll(async ({ browser, page, wallet }) => {
      executionArgs = {
        web: await init.web(browser, page),
        wallet,
      };
      conditionFunction && (await conditionFunction(executionArgs));
    });
  }

  runAfterAll(conditionFunction: ConditionFunction): void {
    conditionFunction &&
      testFixture.afterAll(async () => await conditionFunction(executionArgs));
  }

  runTests(args: IRunTestsArgs): void {
    const { beforeEach, afterEach, tests } = args;
    tests.forEach(suiteTest => {
      const { test, testName, isNewWebContext = false } = suiteTest;
      this.runTestWithWeb({
        test,
        testName,
        isNewWebContext,
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
    const { test, testName, isNewWebContext, beforeEach, afterEach } = args;
    testFixture(testName, async ({ browser, page }) => {
      executionArgs = {
        web: isNewWebContext
          ? await init.web(browser, page)
          : executionArgs.web,
        wallet: executionArgs.wallet,
      };
      await this.runTest({ test, beforeEach, afterEach });
    });
  }
}

const utils = new Utils();
