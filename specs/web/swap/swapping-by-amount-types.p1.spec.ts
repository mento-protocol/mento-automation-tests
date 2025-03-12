import { expect } from "@fixtures/common/common.fixture";
import { defaultSwapAmount, Token } from "@constants/token.constants";
import { suite } from "@helpers/suite/suite.helper";
import { AmountType } from "@services/index";

suite({
  name: "Swap - By amount type",
  beforeEach: async ({ web }) => {
    await web.main.runSwapTestPreconditions();
  },
  tests: [
    {
      name: "Swap-in",
      testCaseId: "@Tab822de9",
      test: async ({ web }) => {
        const initialBalance = await web.main.getTokenBalanceByName(
          Token.cREAL,
        );
        await web.swap.fillForm({
          tokens: { from: Token.CELO, to: Token.cUSD },
          fromAmount: defaultSwapAmount,
        });
        expect
          .soft(Number(await web.swap.getAmountByType(AmountType.Out)))
          .toBeGreaterThan(0);
        await web.swap.start();
        await web.swap.confirm.confirm();
        await web.main.expectIncreasedBalance({
          initialBalance,
          tokenName: Token.CELO,
        });
      },
    },
    {
      name: "Swap-out",
      testCaseId: "@T3c8db175",
      test: async ({ web }) => {
        const initialBalance = await web.main.getTokenBalanceByName(Token.CELO);
        await web.swap.fillForm({
          tokens: { from: Token.cUSD, to: Token.CELO },
          toAmount: defaultSwapAmount,
        });
        expect
          .soft(Number(await web.swap.getAmountByType(AmountType.In)))
          .toBeGreaterThan(0);
        await web.swap.start();
        await web.swap.confirm.confirm();
        await web.main.expectIncreasedBalance({
          initialBalance,
          tokenName: Token.CELO,
        });
      },
    },
  ],
});
