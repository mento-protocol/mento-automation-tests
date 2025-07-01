import { expect } from "@fixtures/common/common.fixture";
import { Token } from "@constants/token.constants";
import { suite } from "@helpers/suite/suite.helper";
import { AmountType } from "@services/index";
import { timeouts } from "@constants/index";
import { TestTag } from "@constants/test.constants";

suite({
  name: "Swap - Amounts",
  tags: [TestTag.Regression, TestTag.Parallel],
  beforeEach: async ({ web }) => {
    await web.main.runSwapTestPreconditions();
  },
  tests: [
    {
      name: "Rates are equal on all the stages",
      testCaseId: "T2332ee03",
      test: async ({ web }) => {
        await web.swap.fillForm({ sellAmount: "1" });
        expect(await web.swap.isRateThere()).toBeTruthy();
        const { beforeSwapRate, afterSwapRate } = await web.swap.swapInputs();
        expect(beforeSwapRate).not.toEqual(afterSwapRate);
        await web.swap.proceedToConfirmation();
        expect(afterSwapRate).toEqual(await web.swap.confirm.getRate());
      },
    },
    {
      name: "The 'Sell' input is auto-calculating when 'Buy' is filled`",
      testCaseId: "T9906952e",
      test: async ({ web }) => {
        await web.swap.fillForm({ buyAmount: "0.0001" });
        expect(await web.swap.isAmountEmpty(AmountType.Sell)).toBeFalsy();
      },
    },
    {
      name: `Use max balance using '${Token.CELO}' as 'Sell'`,
      testCaseId: "Ta34f8bd6",
      test: async ({ web }) => {
        const maxBalance = (
          await web.main.getTokenBalanceByName(Token.CELO)
        ).toString();
        await web.swap.fillForm({
          tokens: { sell: Token.CELO, buy: Token.cUSD },
        });
        await web.swap.useFullBalance();
        expect.soft(await web.swap.getSellTokenAmount()).toEqual(maxBalance);
        expect(await web.swap.isConsiderKeepNotificationThere()).toBeTruthy();
      },
    },
    {
      name: `Use max balance using anything as 'from' besides '${Token.CELO}'`,
      testCaseId: "T80d4fbc3",
      test: async ({ web }) => {
        const maxBalance = (
          await web.main.getTokenBalanceByName(Token.cCHF)
        ).toString();
        await web.swap.fillForm({
          tokens: { sell: Token.cCHF, buy: Token.cUSD },
        });
        await web.swap.useFullBalance();
        expect(await web.swap.getSellTokenAmount()).toEqual(maxBalance);
        expect(await web.swap.isConsiderKeepNotificationThere()).toBeFalsy();
      },
    },
    {
      name: `Trading limit error is shown when the 'Sell' amount exceeds limit`,
      testCaseId: "",
      test: async ({ web }) => {
        await web.swap.swapInputs({
          shouldReturnRates: false,
          clicksOnButton: 2,
        });
        await web.swap.fillForm({
          sellAmount: "600000",
        });
        expect(
          await web.swap.waitForExceedsTradingLimitsNotification(timeouts.m),
        ).toBeTruthy();
        expect(
          await web.swap.waitForExceedsTradingLimitsButton(timeouts.s),
        ).toBeTruthy();
      },
    },
    {
      name: `Trading limit error is shown when the 'Buy' amount exceeds limit`,
      testCaseId: "",
      test: async ({ web }) => {
        await web.swap.swapInputs({
          shouldReturnRates: false,
          clicksOnButton: 2,
        });
        await web.swap.fillForm({
          buyAmount: "600000",
        });
        expect
          .soft(
            await web.swap.waitForExceedsTradingLimitsNotification(timeouts.s),
          )
          .toBeTruthy();
        expect(
          await web.swap.waitForExceedsTradingLimitsButton(timeouts.s),
        ).toBeTruthy();
      },
    },
  ],
});
