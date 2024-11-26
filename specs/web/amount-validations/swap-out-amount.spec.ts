import { expect } from "@fixtures/common.fixture";
import { Token } from "@constants/token.constants";
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
      testCaseId: "",
      test: async ({ web }) => {
        await web.swap.fillForm({ toAmount: "0" });
        await web.swap.continueToConfirmation();
        expect
          .soft(
            await web.swap.isContinueButtonThere(),
            "Continue button is still there",
          )
          .toBeFalsy();
        expect(await web.swap.isAmountRequiredValidationThere()).toBeTruthy();
      },
    },
    {
      name: 'Fill the "swap-out" with an amount that exceeds balance',
      testCaseId: "",
      test: async ({ web }) => {
        await web.swap.fillForm({ toAmount: "100" });
        await web.swap.continueToConfirmation();
        expect.soft(await web.swap.isContinueButtonThere()).toBeFalsy();
        expect(await web.swap.isAmountExceedValidationThere()).toBeTruthy();
      },
    },
    {
      name: 'Fill the "swap-out" with an amount that is too small',
      testCaseId: "",
      test: async ({ web }) => {
        await web.swap.fillForm({ toAmount: "00" });
        await web.swap.continueToConfirmation();
        expect.soft(await web.swap.isContinueButtonThere()).toBeFalsy();
        expect(await web.swap.isAmountTooSmallValidationThere()).toBeTruthy();
      },
    },
  ],
});
