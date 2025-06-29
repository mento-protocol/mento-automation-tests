import { TestTag } from "@constants/test.constants";
import { Token } from "@constants/token.constants";
import { expect } from "@fixtures/common/common.fixture";
import { suite } from "@helpers/suite/suite.helper";
import { WalletName } from "@services/connect-wallet-modal/connect-wallet-modal.service.types";
import { AmountType } from "@services/swap/swap.service.types";

suite({
  name: "Amounts - Sell",
  tags: [TestTag.Regression, TestTag.Parallel, TestTag.Smoke],
  beforeEach: async ({ web }) => {
    await web.main.connectWalletByName(WalletName.Metamask);
    await web.main.waitForBalanceToLoad({ shouldOpenSettings: true });
  },
  tests: [
    {
      name: "Fill the Sell field with an empty amount",
      testCaseId: "Tcc0fa75f",
      test: async ({ web }) => {
        expect.soft(await web.swap.isProceedButtonEnabled()).toBeFalsy();
      },
    },
    {
      name: "Fill the Sell field with an amount that exceeds balance",
      testCaseId: "T2a671992",
      test: async ({ web }) => {
        await web.swap.fillForm({ sellAmount: "700" });
        expect(await web.swap.isAmountExceedValidationThere()).toBeTruthy();
      },
    },
    {
      name: "Fill the Sell field with an amount that is too small",
      testCaseId: "T8a97541b",
      test: async ({ web }) => {
        await web.swap.fillForm({ sellAmount: "00" });
        expect(await web.swap.isProceedButtonEnabled()).toBeFalsy();
      },
    },
    {
      name: "Fill the Sell field with an amount that is high",
      testCaseId: "",
      test: async ({ web }) => {
        const celoBalance = await web.main.getTokenBalanceByName(Token.CELO);
        await web.swap.fillForm({ buyAmount: celoBalance.toString() });
        const highBuyAmount = await web.swap.getAmountByType(AmountType.Buy);
        await web.browser.refresh();
        await web.swap.fillForm({ sellAmount: highBuyAmount.toString() });
        expect.soft(await web.swap.isAmountEmpty(AmountType.Sell)).toBeFalsy();
        expect.soft(await web.swap.isProceedButtonThere()).toBeTruthy();
        expect.soft(await web.swap.isProceedButtonEnabled()).toBeTruthy();
        expect(await web.swap.isInsufficientBalanceButtonThere()).toBeFalsy();
      },
    },
  ],
});
