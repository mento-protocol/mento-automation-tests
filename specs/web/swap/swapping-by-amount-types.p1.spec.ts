import { defaultSwapAmount, Token } from "@constants/token.constants";
import { suite } from "@helpers/suite/suite.helper";

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
          tokens: { sell: tokens.from, buy: tokens.to },
          sellAmount: defaultSwapAmount,
        });
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
          tokens: { sell: tokens.from, buy: tokens.to },
          buyAmount: defaultSwapAmount,
        });
        await web.swap.start();
        await web.main.expectIncreasedBalance({
          initialBalance: initialBalance,
          tokenName: tokens.to,
        });
      },
    },
  ],
});
