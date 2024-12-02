import { expect } from "@fixtures/common/common.fixture";
import { Token } from "@constants/token.constants";
import { suite } from "@helpers/suite/suite.helper";
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
    {
      name: 'Fill the "swap-in" with an empty amount',
      testCaseId: "@Tcc0fa75f",
      test: async ({ web }) => {
        await web.swap.continueToConfirmation();
        expect.soft(await web.swap.isContinueButtonThere()).toBeFalsy();
        expect(await web.swap.isAmountRequiredValidationThere()).toBeTruthy();
      },
    },
    {
      name: 'Fill the "swap-in" with an amount that exceeds balance',
      testCaseId: "@T2a671992",
      test: async ({ web }) => {
        await web.swap.fillForm({ fromAmount: "100" });
        await web.swap.continueToConfirmation();
        expect.soft(await web.swap.isContinueButtonThere()).toBeFalsy();
        expect(await web.swap.isAmountExceedValidationThere()).toBeTruthy();
      },
    },
    {
      name: 'Fill the "swap-in" with an amount that is too small',
      testCaseId: "@T8a97541b",
      test: async ({ web }) => {
        await web.swap.fillForm({ fromAmount: "00" });
        await web.swap.continueToConfirmation();
        expect.soft(await web.swap.isContinueButtonThere()).toBeFalsy();
        expect(await web.swap.isAmountTooSmallValidationThere()).toBeTruthy();
      },
    },
    {
      name: 'Fill the "swap-in" with an amount that exceeds the current trading limits',
      testCaseId: "@T47bdc6d0",
      test: async ({ web }) => {
        await web.swap.fillForm({
          tokens: { to: Token.cUSD },
          toAmount: "2131312312311223212322",
        });
        await web.swap.continueToConfirmation();
        expect
          .soft(
            await web.swap.waitForExceedsTradingLimitsValidation(timeouts.xs),
          )
          .toBeTruthy();
        expect
          .soft(
            (
              await web.swap.page.exceedsTradingLimitErrorLabel.getText()
            ).includes(Token.cUSD),
          )
          .toBeTruthy();
        expect(await web.swap.isErrorValidationThere()).toBeTruthy();
      },
    },
  ],
});
