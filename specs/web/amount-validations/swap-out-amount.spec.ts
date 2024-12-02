import { expect } from "@fixtures/common/common.fixture";
import { suite } from "@helpers/suite/suite.helper";

suite({
  name: "Amount Validations - Swap-Out Amount",
  beforeAll: async ({ web, wallet }) => {
    await web.main.openAppWithConnectedWallet(wallet);
  },
  afterEach: async ({ web }) => {
    await web.swap.browser.refresh();
  },
  tests: [
    {
      name: 'Fill the "swap-out" with an empty amount',
      testCaseId: "@Tc952219e",
      test: async ({ web }) => {
        await web.swap.fillForm({ toAmount: "0" });
        await web.swap.continueToConfirmation();
        expect.soft(await web.swap.isContinueButtonThere()).toBeFalsy();
        expect(await web.swap.isAmountRequiredValidationThere()).toBeTruthy();
      },
    },
    {
      name: 'Fill the "swap-out" with an amount that exceeds balance',
      testCaseId: "@T88e163ac",
      test: async ({ web }) => {
        await web.swap.fillForm({ toAmount: "100" });
        await web.swap.continueToConfirmation();
        expect.soft(await web.swap.isContinueButtonThere()).toBeFalsy();
        expect(await web.swap.isAmountExceedValidationThere()).toBeTruthy();
      },
    },
    {
      name: 'Fill the "swap-out" with an amount that is too small',
      testCaseId: "@T26953592",
      test: async ({ web }) => {
        await web.swap.fillForm({ toAmount: "00" });
        await web.swap.continueToConfirmation();
        expect.soft(await web.swap.isContinueButtonThere()).toBeFalsy();
        expect(await web.swap.isAmountTooSmallValidationThere()).toBeTruthy();
      },
    },
  ],
});
