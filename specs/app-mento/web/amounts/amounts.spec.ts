import { expect } from "@fixtures/test.fixture";
import { defaultSwapAmount, Token } from "@constants/token.constants";
import { testHelper } from "@helpers/test/test.helper";
import { timeouts } from "@constants/timeouts.constants";
import { TestTag } from "@constants/test.constants";

const exceedsTradingLimitAmount = "600000";
testHelper.runSuite({
  name: "Swap - Amounts",
  tags: [TestTag.Regression, TestTag.Parallel],
  retries: 3,
  beforeEach: async ({ web }) => {
    await web.app.appMento.main.runSwapTestPreconditions();
  },
  tests: [
    {
      name: "Rates are equal on all the stages",
      testCaseId: "T2332ee03",
      test: async ({ web }) => {
        const app = web.app.appMento;
        await app.swap.fillForm({
          sellAmount: defaultSwapAmount,
        });
        expect(await app.swap.isRateThere()).toBeTruthy();
        const { beforeSwapRate, afterSwapRate } = await app.swap.swapInputs({
          shouldReturnRates: true,
        });
        expect(beforeSwapRate).not.toEqual(afterSwapRate);
        await app.swap.proceedToConfirmation();
        expect(afterSwapRate).toEqual(await app.swap.confirm.getRate());
      },
    },
    {
      name: `Use max balance using '${Token.CELO}' as 'Sell'`,
      testCaseId: "Ta34f8bd6",
      disable: { reason: "CELO route is not available yet" },
      test: async ({ web }) => {
        const app = web.app.appMento;
        const maxBalance = (
          await app.main.getTokenBalanceByName(Token.CELO)
        ).toString();
        await app.swap.fillForm({
          tokens: { sell: Token.CELO, buy: Token.USDm },
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
          await app.main.getTokenBalanceByName(Token.CHFm, {
            shouldOpenSettings: true,
          })
        ).toString();
        await app.swap.fillForm({ tokens: { sell: Token.CHFm } });
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
  ],
});
