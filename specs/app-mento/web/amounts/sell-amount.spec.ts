import { TestTag } from "@constants/test.constants";
import { Token } from "@constants/token.constants";
import { expect } from "@fixtures/test.fixture";
import { testHelper } from "@helpers/test/test.helper";
import { AmountType } from "../../../../src/apps/app-mento/web/swap/swap.service.types";
import { WalletName } from "../../../../src/apps/shared/web/connect-wallet-modal/connect-wallet-modal.service";

testHelper.runSuite({
  name: "Amounts - Sell",
  tags: [TestTag.Regression, TestTag.Parallel, TestTag.Smoke],
  beforeEach: async ({ web }) => {
    const app = web.app.appMento;
    await app.main.connectWalletByName(WalletName.Metamask);
    await app.main.waitForBalanceToLoad({ shouldOpenSettings: true });
  },
  tests: [
    {
      name: "Fill the Sell field with an empty amount",
      testCaseId: "Tcc0fa75f",
      test: async ({ web }) => {
        expect
          .soft(await web.app.appMento.swap.isProceedButtonEnabled())
          .toBeFalsy();
      },
    },
    {
      name: "Fill the Sell field with an amount that exceeds balance",
      testCaseId: "T2a671992",
      test: async ({ web }) => {
        const app = web.app.appMento;
        await app.swap.fillForm({ sellAmount: "700" });
        expect(await app.swap.isAmountExceedValidationThere()).toBeTruthy();
      },
    },
    {
      name: "Fill the Sell field with an amount that is too small",
      testCaseId: "T8a97541b",
      test: async ({ web }) => {
        const app = web.app.appMento;
        await app.swap.fillForm({ sellAmount: "00" });
        expect(await app.swap.isProceedButtonEnabled()).toBeFalsy();
      },
    },
    {
      name: "Fill the Sell field with high amount",
      testCaseId: "",
      test: async ({ web }) => {
        const app = web.app.appMento;
        const usdcBalance = await app.main.getTokenBalanceByName(Token.USDC, {
          shouldOpenSettings: true,
        });
        // TODO: Replace to usdcBalance once a insufficient liquidity is not relevant
        const highSellAmount = (usdcBalance / 2).toString();
        await app.swap.fillForm({
          tokens: { sell: Token.USDm, buy: Token.CADm },
          sellAmount: highSellAmount,
        });
        await web.browser.refresh();
        await app.swap.fillForm({
          sellAmount: highSellAmount,
        });

        expect.soft(await app.swap.isAmountEmpty(AmountType.Sell)).toBeFalsy();
        expect.soft(await app.swap.isProceedButtonThere()).toBeTruthy();
        expect.soft(await app.swap.isProceedButtonEnabled()).toBeTruthy();
        expect(await app.swap.isInsufficientBalanceButtonThere()).toBeFalsy();
      },
    },
  ],
});
