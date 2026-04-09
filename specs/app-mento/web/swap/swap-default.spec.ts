import { TestTag } from "@constants/test.constants";
import { getDefaultSwapAmount, Token } from "@constants/token.constants";
import { envHelper } from "@helpers/env/env.helper";
import { testHelper } from "@helpers/test/test.helper";

const isFork = envHelper.isFork();
const swapAmount = getDefaultSwapAmount({ isFork });
const tokens = { sell: Token.USDm, buy: Token.GBPm };
// Skip that assertion because loading is so fast on forks
const shouldExpectLoading = isFork ? false : true;

testHelper.runSuite({
  name: "Swap",
  tags: [TestTag.Regression, TestTag.Sequential, TestTag.Smoke],
  beforeEach: async ({ web }) =>
    web.app.appMento.main.runSwapTestPreconditions({ isFork }),
  tests: [
    {
      name: `Swap (${tokens.sell}/${tokens.buy})`,
      testCaseId: "Tab822de9",
      test: async ({ web }) => {
        const app = web.app.appMento;
        const initialBalance = await app.main.getTokenBalanceByName(tokens.buy);
        await app.swap.fillForm({ sellAmount: swapAmount, tokens });
        await app.swap.start({ shouldExpectLoading });
        await app.main.expectUpdatedBalanceOnUi({
          initialBalance,
          tokenName: tokens.buy,
        });
      },
    },
  ],
});
