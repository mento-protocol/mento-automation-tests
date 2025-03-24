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
      name: "Prices are equal on all stages and correct",
      testCaseId: "@T2332ee03",
      test: async ({ web }) => {
        await web.swap.fillForm({
          tokens: { to: Token.CELO, from: Token.cUSD },
          fromAmount: "0.0001",
        });
        expect(await web.swap.isCurrentPriceThere()).toBeTruthy();
        const { beforeSwapPrice, afterSwapPrice } = await web.swap.swapInputs();
        expect(beforeSwapPrice).not.toEqual(afterSwapPrice);
        await web.swap.continueToConfirmation();
        expect(afterSwapPrice).toEqual(
          await web.swap.confirm.getCurrentPriceFromConfirmation(),
        );
      },
    },
    {
      name: "'From' field is auto-calculating when 'to' is filled`",
      testCaseId: "@T9906952e",
      test: async ({ web }) => {
        await web.swap.fillForm({
          tokens: { to: Token.cUSD, from: Token.CELO },
          toAmount: "0.0001",
        });
        expect(await web.swap.isFromInputEmpty()).toBeFalsy();
      },
    },
    {
      name: `Use full balance using '${Token.CELO}' as 'From Token'`,
      testCaseId: "@Ta34f8bd6",
      test: async ({ web }) => {
        await web.swap.fillForm({
          tokens: { from: Token.CELO, to: Token.cUSD },
        });
        await web.swap.useFullBalance();
        expect(await web.swap.isConsiderKeepNotificationThere()).toBeTruthy();
      },
    },
    {
      name: `Use full balance using anything as 'from' besides '${Token.CELO}'`,
      testCaseId: "@T80d4fbc3",
      test: async ({ web }) => {
        await web.swap.fillForm({
          tokens: { from: Token.cUSD, to: Token.CELO },
        });
        await web.swap.useFullBalance();
        expect(await web.swap.isConsiderKeepNotificationThere()).toBeFalsy();
      },
    },
  ],
});
