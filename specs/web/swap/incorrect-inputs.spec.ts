import { expect } from "@fixtures/common.fixture";
import { Token } from "@constants/token.constants";
import { suite } from "@helpers/suite/suite.helper";

suite({
  name: "Swap - validation on incorrect inputs",
  beforeAll: async ({ web, wallet }) => {
    await web.main.openAppWithConnectedWallet(wallet);
  },
  afterEach: async ({ web }) => {
    await web.swap.browser.refresh();
  },
  tests: [
    {
      name: "with an empty amount",
      test: async ({ web }) => {
        await web.swap.continueToConfirmation();
        expect(await web.swap.isAmountRequiredValidationThere()).toBeTruthy();
      },
    },
    {
      name: "with an exceeds balance",
      test: async ({ web }) => {
        await web.swap.fillForm({ fromAmount: "100" });
        await web.swap.continueToConfirmation();
        expect(await web.swap.isAmountExceedValidationThere()).toBeTruthy();
      },
    },
    {
      name: "reject transaction",
      test: async ({ web, wallet }) => {
        await web.swap.fillForm({
          tokens: { from: Token.cEUR, to: Token.CELO },
          fromAmount: "0.0001",
        });
        await web.swap.start();
        await wallet.metamask.reject();
        expect(
          await web.swap.confirm.isRejectedTransactionNotificationThere(),
        ).toBeTruthy();
      },
    },
  ],
});
