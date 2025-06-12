import { expect } from "@fixtures/common/common.fixture";
import { defaultSwapAmount, Token } from "@constants/token.constants";
import { suite } from "@helpers/suite/suite.helper";
import { AmountType } from "@services/index";

const tokens = {
  from: Token.CELO,
  to: Token.cUSD,
};

suite({
  name: "Swap - By amount type",
  beforeEach: async ({ web }) => {
    await web.main.runSwapTestPreconditions();
  },
  tests: [
    {
      name: `Sell (${tokens.from}/${tokens.to})`,
      testCaseId: "@Tab822de9",
      test: async ({ web }) => {
        const initialBalance = await web.main.getTokenBalanceByName(tokens.to);
        await web.swap.fillForm({
          tokens: { from: tokens.from, to: tokens.to },
          sellAmount: defaultSwapAmount,
        });
        expect
          .soft(Number(await web.swap.getAmountByType(AmountType.Buy)))
          .toBeGreaterThan(0);
        await web.swap.start();
        await web.main.expectIncreasedBalance({
          initialBalance,
          tokenName: tokens.to,
        });
      },
    },
    {
      name: `Buy (${tokens.from}/${tokens.to})`,
      testCaseId: "@T3c8db175",
      test: async ({ web }) => {
        const initialBalance = await web.main.getTokenBalanceByName(tokens.to);
        await web.swap.fillForm({
          tokens: { from: tokens.from, to: tokens.to },
          buyAmount: defaultSwapAmount,
        });

        expect
          .soft(Number(await web.swap.getAmountByType(AmountType.Sell)))
          .toBeGreaterThan(0);
        await web.swap.start();
        await web.main.expectIncreasedBalance({
          initialBalance: initialBalance,
          tokenName: tokens.to,
        });
      },
    },
  ],
});
