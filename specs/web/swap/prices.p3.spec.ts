import { expect } from "@fixtures/common/common.fixture";
import { Token } from "@constants/token.constants";
import { suite } from "@helpers/suite/suite.helper";

suite({
  name: "Swap - Prices",
  beforeEach: async ({ web }) => {
    await web.main.runSwapTestPreconditions();
  },
  tests: [
    {
      name: "Rates are equal on all the stages",
      testCaseId: "@T2332ee03",
      test: async ({ web }) => {
        await web.swap.fillForm({
          tokens: { from: Token.cEUR, to: Token.CELO },
          sellAmount: "0.0001",
        });
        expect(await web.swap.isRateThere()).toBeTruthy();
        const { beforeSwapPrice, afterSwapPrice } = await web.swap.swapInputs();
        expect(beforeSwapPrice).not.toEqual(afterSwapPrice);
        await web.swap.proceedToConfirmation();
        expect(afterSwapPrice).toEqual(await web.swap.confirm.getRate());
      },
    },
    {
      name: "'Sell' field is auto-calculating when 'Buy' is filled`",
      testCaseId: "@T9906952e",
      test: async ({ web }) => {
        await web.swap.fillForm({
          tokens: { from: Token.cEUR, to: Token.CELO },
          buyAmount: "0.0001",
        });
        expect(await web.swap.isSellInputEmpty()).toBeFalsy();
      },
    },
    {
      name: `Use max balance using '${Token.CELO}' as 'Sell'`,
      testCaseId: "@Ta34f8bd6",
      test: async ({ web }) => {
        const maxBalance = (
          await web.main.getTokenBalanceByName(Token.CELO)
        ).toString();
        await web.swap.fillForm({
          tokens: { from: Token.CELO, to: Token.cUSD },
        });
        await web.swap.useFullBalance();
        expect(await web.swap.getSellTokenAmount()).toEqual(maxBalance);
        expect(await web.swap.isConsiderKeepNotificationThere()).toBeTruthy();
      },
    },
    {
      name: `Use max balance using anything as 'from' besides '${Token.CELO}'`,
      testCaseId: "@T80d4fbc3",
      test: async ({ web }) => {
        const maxBalance = (
          await web.main.getTokenBalanceByName(Token.cCHF)
        ).toString();
        await web.swap.fillForm({
          tokens: { from: Token.cCHF, to: Token.cUSD },
        });
        await web.swap.useFullBalance();
        expect(await web.swap.getSellTokenAmount()).toEqual(maxBalance);
        expect(await web.swap.isConsiderKeepNotificationThere()).toBeFalsy();
      },
    },
  ],
});
