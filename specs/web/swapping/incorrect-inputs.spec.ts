import { expect, testFixture } from "@fixtures/common.fixture";
import { Token } from "@constants/token.constants";

testFixture.describe("Swap, Negative, Inputs", () => {
  testFixture.beforeEach(async ({ web, wallet }) => {
    await web.main.setupPlatformPreconditions(wallet);
  });
  testFixture("Swapping with an empty amount", async ({ web }) => {
    await web.swap.continueToConfirmation();
    expect(await web.swap.isAmountRequiredValidationThere()).toBeTruthy();
  });
  testFixture("Swapping with an exceeds balance", async ({ web }) => {
    await web.swap.continueToConfirmation();
    await web.swap.fillForm({ fromAmount: "5" });
    expect(await web.swap.isAmountExceedValidationThere()).toBeTruthy();
  });
  testFixture("reject transaction", async ({ web, wallet }) => {
    await web.swap.fillForm({
      tokens: { from: Token.cEUR, to: Token.CELO },
      fromAmount: "0.0001",
    });
    await web.swap.start();
    await wallet.metamask.reject();
    expect(
      await web.swap.isRejectedTransactionNotificationThere(),
    ).toBeTruthy();
  });
});
