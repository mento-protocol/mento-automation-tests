import { expect } from "@fixtures/common/common.fixture";
import { Token } from "@constants/token.constants";
import { suite } from "@helpers/suite/suite.helper";
import { Slippage } from "@services/index";

suite({
  name: "Swap - With custom slippage",
  beforeAll: async ({ web, wallet }) => {
    await web.main.openAppWithConnectedWallet(wallet);
  },
  afterEach: async ({ web }) => {
    await web.swap.browser.refresh();
  },
  tests: [
    {
      name: "perform with default slippage",
      testCaseId: "@T751161b4",
      disable: {
        reason:
          "We have specified swap by token pair with a usage of default slippage all time",
      },
      test: async ({ web, wallet }) => {
        await web.swap.fillForm({
          tokens: { from: Token.cEUR },
          fromAmount: "0.0001",
        });
        expect
          .soft(
            await web.swap.isCurrentPriceThere(),
            "current price is missing",
          )
          .toBeTruthy();
        await web.swap.start();
        await web.swap.confirm.finish(wallet);
        await web.swap.confirm.expectSuccessfulNotifications();
      },
    },
    {
      name: "perform with a minimal slippage",
      testCaseId: "@T0046ec8d",
      test: async ({ web, wallet }) => {
        await web.swap.fillForm({
          slippage: Slippage["0.5%"],
          tokens: { from: Token.cEUR, to: Token.CELO },
          fromAmount: "0.0001",
        });
        await web.swap.start();
        await web.swap.confirm.finish(wallet);
        await web.swap.confirm.expectSuccessfulNotifications();
      },
    },
    {
      name: "perform with a max slippage",
      testCaseId: "@Tb9505e3a",
      test: async ({ web, wallet }) => {
        await web.swap.fillForm({
          slippage: Slippage["1.5%"],
          tokens: { from: Token.cUSD, to: Token.CELO },
          fromAmount: "0.0002",
        });
        await web.swap.start();
        await web.swap.confirm.finish(wallet);
        await web.swap.confirm.expectSuccessfulNotifications();
      },
    },
  ],
});
