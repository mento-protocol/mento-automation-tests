import { expect } from "@fixtures/test.fixture";
import { defaultSwapAmount, Token } from "@constants/token.constants";
import { suite } from "@helpers/suite/suite.helper";
import { timeouts } from "@constants/timeouts.constants";
import { TestTag } from "@constants/test.constants";
import { AmountType } from "../../../../src/apps/app-mento/web/swap/swap.service.types";

const exceedsTradingLimitAmount = "600000";

suite({
  name: "Swap - Amounts",
  tags: [TestTag.Regression, TestTag.Parallel],
  beforeEach: async ({ web }) => {
    await web.app.appMento.main.runSwapTestPreconditions();
  },
  tests: [
    {
      name: "Rates are equal on all the stages",
      testCaseId: "T2332ee03",
      test: async ({ web }) => {
        const app = web.app.appMento;
        await app.swap.fillForm({ sellAmount: defaultSwapAmount });
        expect(await app.swap.isRateThere()).toBeTruthy();
        const { beforeSwapRate, afterSwapRate } = await app.swap.swapInputs();
        expect(beforeSwapRate).not.toEqual(afterSwapRate);
        await app.swap.proceedToConfirmation();
        expect(afterSwapRate).toEqual(await app.swap.confirm.getRate());
      },
    },
    {
      name: "The 'Sell' input is auto-calculating when 'Buy' is filled`",
      testCaseId: "T9906952e",
      test: async ({ web }) => {
        const app = web.app.appMento;
        await app.swap.fillForm({ buyAmount: "0.0001" });
        expect(await app.swap.isAmountEmpty(AmountType.Sell)).toBeFalsy();
      },
    },
    {
      name: `Use max balance using '${Token.CELO}' as 'Sell'`,
      testCaseId: "Ta34f8bd6",
      test: async ({ web }) => {
        const app = web.app.appMento;
        const maxBalance = (
          await app.main.getTokenBalanceByName(Token.CELO)
        ).toString();
        await app.swap.fillForm({
          tokens: { sell: Token.CELO, buy: Token.cUSD },
        });
        await app.swap.useFullBalance();
        expect.soft(await app.swap.getSellTokenAmount()).toEqual(maxBalance);
        expect(await app.swap.isConsiderKeepNotificationThere()).toBeTruthy();
      },
    },
    {
      name: `Use max balance using anything as 'from' besides '${Token.CELO}'`,
      testCaseId: "T80d4fbc3",
      test: async ({ web }) => {
        const app = web.app.appMento;
        const maxBalance = (
          await app.main.getTokenBalanceByName(Token.cCHF)
        ).toString();
        await app.swap.fillForm({
          tokens: { sell: Token.cCHF, buy: Token.cUSD },
        });
        await app.swap.useFullBalance();
        expect(await app.swap.getSellTokenAmount()).toEqual(maxBalance);
        expect(await app.swap.isConsiderKeepNotificationThere()).toBeFalsy();
      },
    },
    {
      name: `Exceeds trading limit error is shown when token has a trading limit`,
      testCaseId: "",
      test: async ({ web }) => {
        const app = web.app.appMento;
        await app.swap.swapInputs({
          shouldReturnRates: false,
        });
        await app.swap.fillForm({
          sellAmount: exceedsTradingLimitAmount,
        });
        expect
          .soft(
            await app.swap.waitForExceedsTradingLimitsNotification(timeouts.m),
          )
          .toBeTruthy();
        expect(
          await app.swap.waitForExceedsTradingLimitsButton(timeouts.s),
        ).toBeTruthy();
      },
    },
    {
      name: `Missing trading limit error is shown when token doesn't have a trading limit`,
      testCaseId: "",
      test: async ({ web }) => {
        const app = web.app.appMento;
        await app.swap.fillForm({
          sellAmount: exceedsTradingLimitAmount,
        });
        expect
          .soft(
            await app.swap.waitForMissingTradingLimitsNotification(timeouts.m),
          )
          .toBeTruthy();
        expect(
          await app.swap.waitForExceedsTradingLimitsButton(timeouts.s),
        ).toBeTruthy();
      },
    },
  ],
});
