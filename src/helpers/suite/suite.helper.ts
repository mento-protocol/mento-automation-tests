import {
  ConditionFunction,
  IDisable,
  IExecution,
  IRunTestArgs,
  IRunTestsArgs,
  IRunTestWithWebArgs,
  ISuiteArgs,
  ITest,
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
    utils.areAllTestsDisabled(tests) &&
      testFixture.skip(
        true,
        "All tests are skipped - please check their disable blocks",
      );
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
      const {
        test,
        name,
        disable,
        isNewWebContext = false,
        testCaseId,
      } = suiteTest;

      this.runTestWithWeb({
        test,
        name,
        isNewWebContext,
        beforeEach,
        afterEach,
        disable,
        testCaseId,
      });
    });
  }

  areAllTestsDisabled(tests: ITest[]): boolean {
    return tests.every(({ disable }) => this.isDisabled(disable));
  }

  private runTestWithWeb(args: IRunTestWithWebArgs): void {
    const {
      test,
      name,
      isNewWebContext,
      beforeEach,
      afterEach,
      disable,
      testCaseId,
    } = args;

    const testName = `${name} [${testCaseId}]`;

    return isNewWebContext
      ? testFixture(testName, async ({ context, page }) => {
          this.isDisabled(disable) && this.disable(disable);
          executionArgs = {
            web: await init.web(context, page),
            wallet: executionArgs.wallet,
          };
          await this.runTest({
            test,
            beforeEach,
            afterEach,
            disable,
          });
        })
      : testFixture(testName, async ({}) => {
          this.isDisabled(disable) && this.disable(disable);
          executionArgs = {
            web: executionArgs.web,
            wallet: executionArgs.wallet,
          };
          await this.runTest({ test, beforeEach, afterEach, disable });
        });
  }

  private async runTest(args: IRunTestArgs): Promise<void> {
    const { test, beforeEach, afterEach } = args;
    beforeEach && (await beforeEach(executionArgs));
    await test(executionArgs);
    afterEach && (await afterEach(executionArgs));
  }

  private isDisabled(disable: IDisable): boolean {
    if (!disable) {
      return false;
    }
    if (!disable.env) {
      return true;
    }
    return disable.env === envHelper.getEnv();
  }

  private disable(disable: IDisable): void {
    this.addDisableAnnotations(disable);
    testFixture.skip(true, `Please check the disable details above ⬆️`);
  }

  private addDisableAnnotations(disable: IDisable): void {
    testFixture.info().annotations.push(
      {
        type: `Reason`,
        description: disable?.reason,
      },
      disable?.link && {
        type: "Link",
        description: disable?.link,
      },
    );
  }
}

const utils = new Utils();
