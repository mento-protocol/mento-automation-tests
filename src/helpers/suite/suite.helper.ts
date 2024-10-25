import {
  ConditionFunction,
  IExecution,
  IRunTestArgs,
  IRunTestsArgs,
  IRunTestWithWebArgs,
  ISuiteArgs,
} from "@helpers/suite/suite.types";
import { loggerHelper } from "@helpers/logger/logger.helper";
import { envHelper } from "@helpers/env/env.helper";
import { init } from "@helpers/init/init.helper";
import { testFixture } from "@fixtures/common.fixture";

const logger = loggerHelper.get("SuiteHelper");
let executionArgs: IExecution = { web: null, wallet: null, context: null };

export function suite(args: ISuiteArgs): void {
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
    utils.runBeforeAll(beforeAll);
    utils.runTests({
      beforeEach,
      afterEach,
      tests,
    });
    utils.runAfterAll(afterAll);
  });
}

class Utils {
  runBeforeAll(conditionFunction: ConditionFunction): void {
    testFixture.beforeAll(async ({ context, page, wallet }) => {
      executionArgs = { web: await init.web(context, page), wallet };
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
      const { test, name, disable, isNewWebContext = false } = suiteTest;
      this.runTestWithWeb({
        test,
        name,
        isNewWebContext,
        beforeEach,
        afterEach,
        disable,
      });
    });
  }

  private runTestWithWeb(args: IRunTestWithWebArgs): void {
    const { test, name, isNewWebContext, beforeEach, afterEach, disable } =
      args;

    return isNewWebContext
      ? testFixture(name, async ({ context, page }) => {
          Boolean(disable) && testFixture.skip(true, disable?.reason);
          executionArgs = {
            web: await init.web(context, page),
            wallet: executionArgs.wallet,
          };
          await this.runTest({ test, beforeEach, afterEach, disable });
        })
      : testFixture(name, async ({}) => {
          Boolean(disable) && testFixture.skip(true, disable?.reason);
          executionArgs = {
            web: executionArgs.web,
            wallet: executionArgs.wallet,
          };
          await this.runTest({ test, beforeEach, afterEach, disable });
        });
  }

  private async runTest(args: IRunTestArgs): Promise<void> {
    const { test, beforeEach, afterEach, disable } = args;
    beforeEach && (await beforeEach(executionArgs));
    await test(executionArgs);
    afterEach && (await afterEach(executionArgs));
  }
}

const utils = new Utils();
