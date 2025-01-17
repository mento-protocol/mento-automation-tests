import { expect } from "@fixtures/common/common.fixture";
import { defaultSwapAmount, Token } from "@constants/token.constants";
import { suite } from "@helpers/suite/suite.helper";
import { AmountType } from "@services/index";

suite({
  name: "Swap - By amount type",
  beforeAll: async ({ web, wallet }) => {
    await web.main.openAppWithConnectedWallet(wallet);
  },
  afterEach: async ({ web }) => {
    await web.swap.browser.refresh();
  },
  tests: [
    {
      name: "Swap-in",
      testCaseId: "@Tab822de9",
      disable: { reason: "Swap-in amount tests all time with all swap tests" },
      test: async ({ web, wallet }) => {
        await web.swap.fillForm({
          tokens: { from: Token.CELO, to: Token.cREAL },
          fromAmount: defaultSwapAmount,
        });
        const initialBalance = await web.main.getTokenBalanceByName(
          Token.cREAL,
        );
        expect
          .soft(
            Number(await web.swap.getAmountByType(AmountType.Out)),
            "swap-out amount is not calculated",
          )
          .toBeGreaterThan(0);
        await web.swap.start();
        await web.swap.confirm.finish(wallet);
        await web.swap.confirm.expectSuccessfulNotifications();
        await web.swap.confirm.expectChangedBalance({
          currentBalance: await web.main.getTokenBalanceByName(Token.cREAL),
          initialBalance,
        });
      },
    },
    {
      name: "Swap-out",
      testCaseId: "@T3c8db175",
      test: async ({ web, wallet }) => {
        await web.swap.fillForm({
          tokens: { from: Token.cEUR, to: Token.CELO },
          toAmount: defaultSwapAmount,
        });
        const initialBalance = await web.main.getTokenBalanceByName(Token.CELO);
        expect
          .soft(Number(await web.swap.getAmountByType(AmountType.In)))
          .toBeGreaterThan(0);
        await web.swap.start();
        await web.swap.confirm.finish(wallet);
        await web.swap.confirm.expectSuccessfulNotifications();
        await web.swap.confirm.expectChangedBalance({
          currentBalance: await web.main.getTokenBalanceByName(Token.CELO),
          initialBalance,
        });
      },
    },
  ],
});
