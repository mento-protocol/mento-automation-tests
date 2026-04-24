import { TestDetails } from "@playwright/test";

import {
  IDisable,
  ISuiteArgs as IRunSuiteArgs,
  ITest,
} from "@helpers/test/test.types";
import { loggerHelper } from "@helpers/logger/logger.helper";
import { envHelper } from "@helpers/env/env.helper";
import { testFixture } from "@fixtures/test.fixture";

const log = loggerHelper.get("SuiteHelper");

class TestHelper {
  runSuite({
    name: suiteName,
    tests,
    beforeAll,
    beforeEach,
    afterEach,
    afterAll,
    retries,
    tags: rawTags = [],
  }: IRunSuiteArgs) {
    const tags = this.composeTags(rawTags);

    retries && testFixture.describe.configure({ retries });

    testFixture.describe(suiteName, { tag: tags }, () => {
      testFixture.beforeAll(async ({ api }) => {
        this.logRunDetails(suiteName);
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

      tests.forEach(params => this.runTest(params));
    });
  }

  runTest({
    test,
    name: testName,
    disable,
    testCaseId,
    timeout,
    tags: rawTags = [],
  }: ITest): void {
    const tags = this.composeTags([...rawTags, testCaseId]);

    this.isDisabled(disable)
      ? testFixture.skip(
          testName,
          {
            tag: tags,
            ...this.getDisableDetailsOnStart(disable),
          },
          async ({ web, metamaskHelper, api, contractHelper }) =>
            await test({ web, metamaskHelper, api, contractHelper }),
        )
      : testFixture(
          testName,
          { tag: tags },
          async ({ web, metamaskHelper, api, contractHelper }) => {
            timeout && testFixture.setTimeout(timeout);
            await test({ web, metamaskHelper, api, contractHelper });
          },
        );
  }

  skipInRuntime(disable: IDisable, beforeSkipLogMessage?: string): void {
    beforeSkipLogMessage &&
      log.warn(`❗️ Disabled in runtime because of: ${beforeSkipLogMessage}`);
    this.addDisableDetailsInRuntime(disable);
    testFixture.skip(true, `Please check the disable details above ⬆️`);
  }

  private isDisabled(disable?: IDisable): boolean {
    if (!disable) return false;
    if (disable.chainType) {
      return disable.chainType === envHelper.getChainType();
    }
    if (disable.chainName) {
      return disable.chainName === envHelper.getChainName();
    }
    if (!disable.env) return true;
    return disable.env === envHelper.getEnv();
  }

  private addDisableDetailsInRuntime(disable: IDisable): void {
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
    disable?.chainType &&
      testFixture.info().annotations.push({
        type: "⛓️‍💥 Chain",
        description: disable?.chainType,
      });
  }

  private getDisableDetailsOnStart(disable?: IDisable): TestDetails {
    if (!disable) {
      return { annotation: [] };
    }
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
  }

  private logRunDetails(suiteName: string): void {
    const url = envHelper.getBaseWebUrl();
    const env = envHelper.getEnv();
    const isFork = envHelper.isFork();
    const chain = `${envHelper.getChainName()} (${envHelper.getChainType()})`;
    const config = `\n        ENV: ${env}\n        URL: ${url}\n        CHAIN: ${chain}\n        IS_FORK: ${isFork}`;
    log.info(`Running '${suiteName}' suite with configuration: ${config}`);
  }

  private composeTags(tags: string[]): string[] {
    return tags?.map(tag => `@${tag}`);
  }
}

export const testHelper = new TestHelper();
