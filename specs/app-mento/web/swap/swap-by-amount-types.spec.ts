import { TestTag } from "@constants/test.constants";
import { getSwapAmount, Token } from "@constants/token.constants";
import { envHelper } from "@helpers/env/env.helper";
import { suite } from "@helpers/suite/suite.helper";

const isFork = envHelper.isFork();
const swapAmount = getSwapAmount({ isFork });
const tokens = { from: Token.CELO, to: Token.cUSD };
// Skip that assertion because loading is so fast on forks
const shouldExpectLoading = isFork ? false : true;

suite({
  name: "Swap - By amount type",
  tags: [TestTag.Regression, TestTag.Sequential, TestTag.Smoke],
  beforeEach: async ({ web }) =>
    web.app.appMento.main.runSwapTestPreconditions({ isFork }),
  tests: [
    {
      name: `Sell (${tokens.from}/${tokens.to})`,
      testCaseId: "Tab822de9",
      test: async ({ web }) => {
        const app = web.app.appMento;
        const initialBalance = await app.main.getTokenBalanceByName(tokens.to);
        await app.swap.fillForm({
          tokens: { sell: tokens.from, buy: tokens.to },
          sellAmount: swapAmount,
        });
        await app.swap.start({ shouldExpectLoading });
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
          buyAmount: swapAmount,
        });
        await app.swap.start({ shouldExpectLoading });
        await app.main.expectIncreasedBalance({
          initialBalance: initialBalance,
          tokenName: tokens.to,
        });
      },
    },
  ],
});
