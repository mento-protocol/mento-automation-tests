import { expect, testFixture } from "@fixtures/common.fixture";
import { primitiveHelper } from "@helpers/primitive/primitive.helper";
import { cTokens, Token } from "@constants/token.constants";

testFixture.describe("Swap, Positive, Prices", () => {
  testFixture.beforeEach(async ({ web, wallet }) => {
    await web.main.setupPlatformPreconditions(wallet);
  });
  testFixture(
    "Swapping prices are equal on all stages and correct",
    async ({ web }) => {
      await web.swap.fillForm({
        tokens: { from: Token.cEUR, to: Token.CELO },
        fromAmount: "0.0001",
      });
      expect(await web.swap.isCurrentPriceThere()).toBeTruthy();
      const { beforeSwapPrice, afterSwapPrice } = await web.swap.swapInputs();
      expect(beforeSwapPrice).not.toEqual(afterSwapPrice);
      await web.swap.continueToConfirmation();
      expect(afterSwapPrice).toEqual(
        await web.swap.getCurrentPriceFromConfirmation(),
      );
    },
  );
  testFixture(
    `'From' field auto-calculating when 'to' is filled`,
    async ({ web }) => {
      await web.swap.fillForm({
        tokens: { to: Token.cUSD },
        toAmount: "0.0001",
      });
      expect(await web.swap.isFromInputEmpty()).toBeFalsy();
    },
  );
  testFixture(
    `Use full balance using '${Token.CELO}' as 'from'`,
    async ({ web }) => {
      await web.swap.fillForm({
        tokens: { from: Token.CELO },
      });
      await web.swap.useFullBalance();
      expect(await web.swap.isConsiderKeepNotificationThere()).toBeTruthy();
    },
  );
  testFixture(
    `Use full balance using anything as 'from' besides '${Token.CELO}'`,
    async ({ web }) => {
      await web.swap.fillForm({
        tokens: { from: primitiveHelper.getRandomFrom(cTokens) },
      });
      await web.swap.useFullBalance();
      expect(await web.swap.isConsiderKeepNotificationThere()).toBeFalsy();
    },
  );
});
