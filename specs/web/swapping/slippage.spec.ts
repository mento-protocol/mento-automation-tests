import { expect, testFixture } from "@fixtures/common.fixture";
import { Token } from "@constants/token.constants";
import { Slippage } from "@web/services/types/get-web-services.types";

testFixture.describe("Swap, Positive, Slippage", () => {
  testFixture.beforeEach(async ({ web, wallet }) => {
    await web.main.setupPlatformPreconditions(wallet);
  });
  testFixture("with default slippage", async ({ web, wallet, context }) => {
    await web.swap.fillForm({
      tokens: { from: Token.cEUR },
      fromAmount: "0.0001",
    });
    expect(await web.swap.isCurrentPriceThere()).toBeTruthy();
    await web.swap.start();
    await wallet.helper.approveTransactionTwice();
    await web.swap.expectSuccessfulTransaction(context);
  });
  testFixture("with lowest slippage", async ({ web, wallet, context }) => {
    await web.swap.fillForm({
      slippage: Slippage["0.5%"],
      tokens: { from: Token.cEUR, to: Token.CELO },
      fromAmount: "0.0001",
    });
    await web.swap.start();
    await wallet.helper.approveTransactionTwice();
    await web.swap.expectSuccessfulTransaction(context);
  });
  testFixture("with highest slippage", async ({ web, wallet, context }) => {
    await web.swap.fillForm({
      slippage: Slippage["1.5%"],
      tokens: { from: Token.cUSD, to: Token.CELO },
      fromAmount: "0.0002",
    });
    await web.swap.start();
    await wallet.helper.approveTransactionTwice();
    await web.swap.expectSuccessfulTransaction(context);
  });
});
