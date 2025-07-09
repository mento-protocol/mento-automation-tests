import { TestTag } from "@constants/test.constants";
import { Token } from "@constants/token.constants";
import { expect } from "@fixtures/test.fixture";
import { suite } from "@helpers/suite/suite.helper";
import { AmountType } from "../../../../src/apps/app-mento/web/swap/swap.service.types";

suite({
  name: "Amounts - Buy",
  tags: [TestTag.Regression, TestTag.Parallel, TestTag.Smoke],
  beforeEach: async ({ web }) =>
    web.app.appMento.main.runSwapTestPreconditions(),
  tests: [
    {
      name: "Fill the Buy field with an empty amount",
      testCaseId: "Tc952219e",
      test: async ({ web }) => {
        expect
          .soft(await web.app.appMento.swap.isProceedButtonEnabled())
          .toBeFalsy();
      },
    },
    {
      name: "Fill the Buy field with an amount that exceeds balance",
      testCaseId: "T88e163ac",
      test: async ({ web }) => {
        const { appMento } = web.app;
        await appMento.swap.fillForm({ buyAmount: "700" });
        expect(
          await appMento.swap.isAmountExceedValidationThere(),
        ).toBeTruthy();
      },
    },
    {
      name: "Fill the Buy field with an amount that is too small",
      testCaseId: "T26953592",
      test: async ({ web }) => {
        const { appMento } = web.app;
        await appMento.swap.fillForm({ buyAmount: "00" });
        expect(await appMento.swap.isProceedButtonEnabled()).toBeFalsy();
      },
    },
    {
      name: "Fill the Buy field with an amount that is high",
      testCaseId: "",
      test: async ({ web }) => {
        const { appMento } = web.app;
        const celoBalance = await appMento.main.getTokenBalanceByName(
          Token.CELO,
        );
        await appMento.swap.fillForm({ sellAmount: celoBalance.toString() });
        const highBuyAmount = await appMento.swap.getAmountByType(
          AmountType.Buy,
        );
        await web.browser.refresh();
        await appMento.swap.fillForm({ buyAmount: highBuyAmount.toString() });
        expect
          .soft(await appMento.swap.isAmountEmpty(AmountType.Sell))
          .toBeFalsy();
        expect.soft(await appMento.swap.isProceedButtonThere()).toBeTruthy();
        expect.soft(await appMento.swap.isProceedButtonEnabled()).toBeTruthy();
        expect(
          await appMento.swap.isInsufficientBalanceButtonThere(),
        ).toBeFalsy();
      },
    },
  ],
});
