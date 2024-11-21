import { expect } from "@fixtures/common.fixture";
import { Token } from "@constants/token.constants";
import { suite } from "@helpers/suite/suite.helper";
import { waiterHelper } from "@helpers/waiter/waiter.helper";
import { timeouts } from "@constants/timeouts.constants";

suite({
  name: "Amount Validations - Swap-In Amount",
  beforeAll: async ({ web, wallet }) => {
    await web.main.openAppWithConnectedWallet(wallet);
  },
  afterEach: async ({ web }) => {
    await web.swap.browser.refresh();
  },
  tests: [
    // {
    //   name: 'Fill the "swap-in" with an empty amount',
    //   testCaseId: "@Tcc0fa75f",
    //   test: async ({ web }) => {
    //     await web.swap.continueToConfirmation();
    //     expect
    //       .soft(
    //         await web.swap.isContinueButtonThere(),
    //         "Continue button is still there",
    //       )
    //       .toBeFalsy();
    //     expect(
    //       await web.swap.isAmountRequiredValidationThere(),
    //       "Amount Required button is not displayed",
    //     ).toBeTruthy();
    //   },
    // },
    // {
    //   name: 'Fill the "swap-in" with an amount that exceeds balance',
    //   testCaseId: "@T2a671992",
    //   test: async ({ web }) => {
    //     await web.swap.fillForm({ fromAmount: "100" });
    //     await web.swap.continueToConfirmation();
    //     expect
    //       .soft(
    //         await web.swap.isContinueButtonThere(),
    //         "Continue button is still there",
    //       )
    //       .toBeFalsy();
    //     expect(
    //       await web.swap.isAmountExceedValidationThere(),
    //       "Amount Exceeds button is not displayed",
    //     ).toBeTruthy();
    //   },
    // },
    // {
    //   name: 'Fill the "swap-in" with an amount that is too small',
    //   testCaseId: "@T8a97541b",
    //   test: async ({ web }) => {
    //     await web.swap.fillForm({ fromAmount: "00" });
    //     await web.swap.continueToConfirmation();
    //     expect
    //       .soft(
    //         await web.swap.isContinueButtonThere(),
    //         "Continue button is still there",
    //       )
    //       .toBeFalsy();
    //     expect(
    //       await web.swap.isAmountTooSmallValidationThere(),
    //       "Amount Too Small button is not displayed",
    //     ).toBeTruthy();
    //   },
    // },
    {
      name: 'Fill the "swap-in" with an amount that exceeds the current trading limits',
      testCaseId: "@T47bdc6d0",
      test: async ({ web }) => {
        await web.swap.fillForm({ toAmount: "2131312312311223212322" });
        await web.swap.continueToConfirmation();
        // TO REMOVE
        // await web.swap.browser.pause();
        expect
          .soft(
            await web.swap.isExceedsTradingLimitsValidationThere(),
            "Exceeds trading limits error has not appeared",
          )
          .toBeTruthy();
        expect(
          await web.swap.isErrorValidationThere(),
          "Error button is not displayed",
        ).toBeTruthy();
      },
    },
  ],
});
