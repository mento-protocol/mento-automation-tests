import { TestTag } from "@constants/test.constants";
import { Token } from "@constants/token.constants";
import { expect } from "@fixtures/common/common.fixture";
import { suite } from "@helpers/suite/suite.helper";
import { AmountType } from "@services/swap/swap.service.types";

suite({
  name: "Amounts - Buy",
  tags: [TestTag.Regression, TestTag.Parallel, TestTag.Smoke],
  beforeEach: async ({ web }) => web.main.runSwapTestPreconditions(),
  tests: [
    {
      name: "Fill the Buy field with an empty amount",
      testCaseId: "Tc952219e",
      test: async ({ web }) => {
        expect.soft(await web.swap.isProceedButtonEnabled()).toBeFalsy();
      },
    },
    {
      name: "Fill the Buy field with an amount that exceeds balance",
      testCaseId: "T88e163ac",
      test: async ({ web }) => {
        await web.swap.fillForm({ buyAmount: "700" });
        expect(await web.swap.isAmountExceedValidationThere()).toBeTruthy();
      },
    },
    {
      name: "Fill the Buy field with an amount that is too small",
      testCaseId: "T26953592",
      test: async ({ web }) => {
        await web.swap.fillForm({ buyAmount: "00" });
        expect(await web.swap.isProceedButtonEnabled()).toBeFalsy();
      },
    },
    {
      name: "Fill the Buy field with an amount that is high",
      testCaseId: "",
      test: async ({ web }) => {
        const celoBalance = await web.main.getTokenBalanceByName(Token.CELO);
        await web.swap.fillForm({ sellAmount: celoBalance.toString() });
        const highBuyAmount = await web.swap.getAmountByType(AmountType.Buy);
        await web.browser.refresh();
        await web.swap.fillForm({ buyAmount: highBuyAmount.toString() });
        expect.soft(await web.swap.isAmountEmpty(AmountType.Sell)).toBeFalsy();
        expect.soft(await web.swap.isProceedButtonThere()).toBeTruthy();
        expect.soft(await web.swap.isProceedButtonEnabled()).toBeTruthy();
        expect(await web.swap.isInsufficientBalanceButtonThere()).toBeFalsy();
      },
    },
  ],
});
