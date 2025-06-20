import { expect } from "@fixtures/common/common.fixture";
import { suite } from "@helpers/suite/suite.helper";
import { WalletName } from "@services/connect-wallet-modal/connect-wallet-modal.service.types";

suite({
  name: "Amount Validations - Swap-Out Amount",
  beforeEach: async ({ web }) => {
    await web.main.connectWalletByName(WalletName.Metamask);
    await web.main.waitForBalanceToLoad({ shouldOpenSettings: true });
  },
  tests: [
    {
      name: 'Fill the "swap-out" with an empty amount',
      testCaseId: "@Tc952219e",
      test: async ({ web }) => {
        expect.soft(await web.swap.isProceedButtonEnabled()).toBeFalsy();
      },
    },
    {
      name: 'Fill the "swap-out" with an amount that exceeds balance',
      testCaseId: "@T88e163ac",
      test: async ({ web }) => {
        await web.swap.fillForm({ buyAmount: "700" });
        expect(await web.swap.isAmountExceedValidationThere()).toBeTruthy();
      },
    },
    {
      name: 'Fill the "swap-out" with an amount that is too small',
      testCaseId: "@T26953592",
      test: async ({ web }) => {
        await web.swap.fillForm({ buyAmount: "00" });
        expect(await web.swap.isProceedButtonEnabled()).toBeFalsy();
      },
    },
  ],
});
