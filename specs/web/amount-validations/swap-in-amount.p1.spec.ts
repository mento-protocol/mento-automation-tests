import { expect } from "@fixtures/common/common.fixture";
import { suite } from "@helpers/suite/suite.helper";
import { WalletName } from "@services/connect-wallet-modal/connect-wallet-modal.service.types";

suite({
  name: "Amount Validations - Swap-In Amount",
  beforeEach: async ({ web }) => {
    await web.main.connectWalletByName(WalletName.Metamask);
    await web.main.waitForBalanceToLoad({ shouldOpenSettings: true });
  },
  tests: [
    {
      name: 'Fill the "swap-in" with an empty amount',
      testCaseId: "@Tcc0fa75f",
      test: async ({ web }) => {
        expect.soft(await web.swap.isProceedButtonEnabled()).toBeFalsy();
      },
    },
    {
      name: 'Fill the "swap-in" with an amount that exceeds balance',
      testCaseId: "@T2a671992",
      test: async ({ web }) => {
        await web.swap.fillForm({ sellAmount: "700" });
        expect(await web.swap.isAmountExceedValidationThere()).toBeTruthy();
      },
    },
    {
      name: 'Fill the "swap-in" with an amount that is too small',
      testCaseId: "@T8a97541b",
      test: async ({ web }) => {
        await web.swap.fillForm({ sellAmount: "00" });
        expect(await web.swap.isProceedButtonEnabled()).toBeFalsy();
      },
    },
  ],
});
