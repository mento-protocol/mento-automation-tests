import { TestDetails } from "playwright/types/test";

import { IDisable, ISuiteArgs } from "@helpers/suite/suite.types";
import { loggerHelper } from "@helpers/logger/logger.helper";
import { envHelper } from "@helpers/env/env.helper";
import { testFixture } from "@fixtures/test.fixture";

const logger = loggerHelper.get("SuiteHelper");

export function suite({
  name: suiteName,
  tests,
  beforeAll,
  beforeEach,
  afterEach,
  afterAll,
  retries,
  tags: rawTags = [],
}: ISuiteArgs): void {
  const tags = composeTags(rawTags);

  retries && testFixture.describe.configure({ retries });
  testFixture.describe(suiteName, { tag: tags }, () => {
    testFixture.beforeAll(async ({ api }) => {
      logRunDetails(suiteName);
      beforeAll && (await beforeAll({ api }));
    });
    afterAll && testFixture.afterAll(async ({ api }) => afterAll({ api }));

    beforeEach &&
      testFixture.beforeEach(
        async ({ web, metamaskHelper, api, contractHelper }) =>
          await beforeEach({ web, metamaskHelper, api, contractHelper }),
      );
    afterEach &&
      testFixture.afterEach(
        async ({ web, metamaskHelper, api, contractHelper }) =>
          afterEach({ web, metamaskHelper, api, contractHelper }),
      );

    tests.forEach(
      ({
        test,
        name: testName,
        disable,
        testCaseId,
        timeout,
        tags: rawTags = [],
      }) => {
        const tags = composeTags([...rawTags, testCaseId]);

        testUtils.isDisabled(disable)
          ? testFixture.skip(
              testName,
              {
                tag: tags,
                ...testUtils.getDisableDetailsOnStart(disable),
              },
              async ({ web, metamaskHelper, contractHelper }) =>
                await test({ web, metamaskHelper, contractHelper }),
            )
          : testFixture(
              testName,
              { tag: tags },
              async ({ web, metamaskHelper, api, contractHelper }) => {
                timeout && testFixture.setTimeout(timeout);
                await test({ web, metamaskHelper, api, contractHelper });
              },
            );
      },
    );
  });
}

export const testUtils = {
  disableInRuntime(disable: IDisable, beforeSkipLogMessage?: string): void {
    beforeSkipLogMessage &&
      logger.warn(
        `❗️ Disabled in runtime because of: ${beforeSkipLogMessage}`,
      );
    this.addDisableDetailsInRuntime(disable);
    testFixture.skip(true, `Please check the disable details above ⬆️`);
  },

  isDisabled(disable: IDisable): boolean {
    if (!disable) return false;
    if (disable.chain) {
      return disable.chain === envHelper.getChainName() ? true : false;
    }
    if (!disable.env) return true;
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
    disable?.env &&
      testFixture.info().annotations.push({
        type: "🌐 Environment",
        description: disable?.env,
      });
    disable?.chain &&
      testFixture.info().annotations.push({
        type: "⛓️‍💥 Chain",
        description: disable?.chain,
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

function logRunDetails(suiteName: string): void {
  const env = envHelper.isCustomUrl()
    ? `Custom with '${envHelper.getBaseWebUrl()}' URL`
    : `Regular '${envHelper.getEnv()}' with '${envHelper.getBaseWebUrl()}' URL`;
  const chain = `${envHelper.getChainName()} (${envHelper.getChainType()})`;
  const config = `\n        ENV: ${env}\n        CHAIN: ${chain}\n        PID: ${process.pid}`;
  logger.info(`Running '${suiteName}' suite with configuration: ${config}`);
}

function composeTags(tags: string[]): string[] {
  return tags?.map(tag => `@${tag}`);
}
