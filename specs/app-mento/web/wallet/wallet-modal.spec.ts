import { TestTag } from "@constants/test.constants";
import { timeouts } from "@constants/timeouts.constants";
import { expect } from "@fixtures/test.fixture";
import { suite } from "@helpers/suite/suite.helper";

suite({
  name: "Wallet modal",
  tags: [TestTag.Regression, TestTag.Parallel],
  tests: [
    {
      name: "Open by header button",
      testCaseId: "T112a63d0",
      test: async ({ web }) => {
        const app = web.app.appMento;
        await app.main.openConnectWalletModalFromHeader();
        expect(await app.main.connectWalletModal.page.isOpen()).toBeTruthy();
      },
    },
    {
      name: "Open by main button",
      testCaseId: "T224b25fc",
      test: async ({ web }) => {
        const app = web.app.appMento;
        await app.main.openConnectWalletModal();
        expect(await app.main.connectWalletModal.page.isOpen()).toBeTruthy();
      },
    },
    {
      name: "Close by clicking its button",
      testCaseId: "T2836c736",
      test: async ({ web }) => {
        const app = web.app.appMento;
        await app.main.openConnectWalletModal();
        await app.main.connectWalletModal.close({ throwError: false });
        expect(
          await app.main.connectWalletModal.page.isClosed({
            timeout: timeouts.xxs,
          }),
        ).toBeTruthy();
        expect(
          await app.main.page.isOpen({ timeout: timeouts.xxs }),
        ).toBeTruthy();
      },
    },
  ],
});
