import { expect } from "@fixtures/common.fixture";
import { Token } from "@constants/token.constants";
import { Slippage } from "@services/types/get-web-services.types";
import { suite } from "@helpers/suite/suite.helper";

suite({
  name: "Swap - Slippage",
  beforeAll: async ({ web, wallet }) => {
    await web.main.openAppWithConnectedWallet(wallet);
  },
  afterEach: async ({ web }) => {
    await web.swap.browser.refresh();
  },
  tests: [
    {
      name: "perform with default slippage",
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
        await wallet.helper.approveTransactionTwice();
        await web.swap.confirm.expectSuccessfulTransaction();
      },
    },
    {
      name: "perform with lowest slippage",
      test: async ({ web, wallet }) => {
        await web.swap.fillForm({
          slippage: Slippage["0.5%"],
          tokens: { from: Token.cEUR, to: Token.CELO },
          fromAmount: "0.0001",
        });
        await web.swap.start();
        await wallet.helper.approveTransactionTwice();
        await web.swap.confirm.expectSuccessfulTransaction();
      },
    },
    {
      name: "perform with highest slippage",
      test: async ({ web, wallet }) => {
        await web.swap.fillForm({
          slippage: Slippage["1.5%"],
          tokens: { from: Token.cUSD, to: Token.CELO },
          fromAmount: "0.0002",
        });
        await web.swap.start();
        await wallet.helper.approveTransactionTwice();
        await web.swap.confirm.expectSuccessfulTransaction();
      },
    },
  ],
});
