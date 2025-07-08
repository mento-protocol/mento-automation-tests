import { TestTag } from "@constants/test.constants";
import { defaultSwapAmount, Token } from "@constants/token.constants";
import { suite } from "@helpers/suite/suite.helper";

const tokens = {
  from: Token.CELO,
  to: Token.cUSD,
};

suite({
  name: "Swap - By amount type",
  tags: [TestTag.Regression, TestTag.Sequential, TestTag.Smoke],
  beforeEach: async ({ web }) =>
    await web.app.appMento.main.runSwapTestPreconditions(),
  tests: [
    {
      name: `Sell (${tokens.from}/${tokens.to})`,
      testCaseId: "Tab822de9",
      test: async ({ web }) => {
        const app = web.app.appMento;
        const initialBalance = await app.main.getTokenBalanceByName(tokens.to);
        await app.swap.fillForm({
          tokens: { sell: tokens.from, buy: tokens.to },
          sellAmount: defaultSwapAmount,
        });
        await app.swap.start();
        await app.main.expectIncreasedBalance({
          initialBalance,
          tokenName: tokens.to,
        });
      },
    },
    {
      name: `Buy (${tokens.from}/${tokens.to})`,
      testCaseId: "T3c8db175",
      test: async ({ web }) => {
        const app = web.app.appMento;
        const initialBalance = await app.main.getTokenBalanceByName(tokens.to);
        await app.swap.fillForm({
          tokens: { sell: tokens.from, buy: tokens.to },
          buyAmount: defaultSwapAmount,
        });
        await app.swap.start();
        await app.main.expectIncreasedBalance({
          initialBalance: initialBalance,
          tokenName: tokens.to,
        });
      },
    },
  ],
});
