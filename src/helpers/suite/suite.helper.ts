import { IDisable, ISuiteArgs } from "@helpers/suite/suite.types";
import { loggerHelper } from "@helpers/logger/logger.helper";
import { envHelper } from "@helpers/env/env.helper";
import { testFixture } from "@fixtures/common/common.fixture";
import { TestDetails } from "playwright/types/test";

const logger = loggerHelper.get("SuiteHelper");

export function suite({
  name: suiteName,
  tests,
  beforeAll,
  beforeEach,
  afterEach,
  afterAll,
}: ISuiteArgs): void {
  logger.info(
    `Running '${suiteName}' suite against '${envHelper.getEnv()}' on ${
      process.pid
    } PID`,
  );

  testFixture.describe(suiteName, () => {
    beforeAll && testFixture.beforeAll(async ({ api }) => beforeAll({ api }));
    afterAll && testFixture.afterAll(async ({ api }) => afterAll({ api }));

    beforeEach &&
      testFixture.beforeEach(
        async ({ web, metamaskHelper, api }) =>
          await beforeEach({ web, metamaskHelper, api }),
      );
    afterEach &&
      testFixture.afterEach(async ({ web, metamaskHelper, api }) =>
        afterEach({ web, metamaskHelper, api }),
      );

    tests.forEach(({ test, name, disable, testCaseId }) => {
      const testName = `${name} [${testCaseId}]`;

      testUtils.isDisabled(disable)
        ? testFixture.skip(
            testName,
            testUtils.getDisableDetailsOnStart(disable),
            async ({ web, metamaskHelper }) => {
              await test({ web, metamaskHelper });
            },
          )
        : testFixture(testName, async ({ web, metamaskHelper, api }) => {
            await test({ web, metamaskHelper, api });
          });
    });
  });
}

export const testUtils = {
  disableInRuntime(disable: IDisable, beforeSkipLogMessage?: string): void {
    beforeSkipLogMessage && logger.warn(`❗️ ${beforeSkipLogMessage}`);
    this.addDisableDetailsInRuntime(disable);
    testFixture.skip(true, `Please check the disable details above ⬆️`);
  },

  isDisabled(disable: IDisable): boolean {
    if (!disable) {
      return false;
    }
    if (!disable.env) {
      return true;
    }
    return disable.env === envHelper.getEnv();
  },

  addDisableDetailsInRuntime(disable: IDisable): void {
    testFixture.info().annotations.push({
      type: "❕ Reason",
      description: disable.reason,
    });
    disable?.link &&
      testFixture.info().annotations.push({
        type: "🔗 Link",
        description: disable?.link,
      });
  },

  getDisableDetailsOnStart(disable: IDisable): TestDetails {
    return {
      annotation: [
        {
          type: "❕ Reason",
          description: `️${disable.reason}`,
        },
        {
          type: "🔗 Link",
          description: `${disable.link || "---"}`,
        },
      ],
    };
  },
};
