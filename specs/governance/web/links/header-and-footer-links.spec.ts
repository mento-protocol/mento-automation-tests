import { TestTag } from "@constants/test.constants";
import { expect } from "@fixtures/test.fixture";
import { suite } from "@helpers/suite/suite.helper";
import { timeouts } from "@constants/timeouts.constants";
import { governanceHeaderAndFooterLinks } from "@constants/governanceUrl.constants";
import { IExecution } from "@helpers/suite/suite.types";

const testCases = [
  { name: "forum" },
  { name: "x" },
  { name: "github" },
  { name: "discord" },
  { name: "mentoOrg" },
  { name: "reserve" },
  { name: "privacyPolicy" },
];

suite({
  name: "Verify header and footer links",
  tags: [TestTag.Regression, TestTag.Parallel, TestTag.Smoke],
  tests: [
    ...testCases.map(testCase => ({
      name: `'${testCase.name}' link match`,
      testCaseId: "",
      test: async ({ web }: IExecution) => {
        const app = web.app.governance;

        const newTabPage = await app.main.browser.getNewTabPage({
          navigateCallback: async () => {
            await app.main.page.headerAndFooterLinkButtons[
              testCase.name
            ].click();
          },
          waitTimeout: timeouts.xxxs,
        });

        expect(newTabPage.url()).toBe(
          governanceHeaderAndFooterLinks[testCase.name],
        );
      },
    })),
  ],
});
