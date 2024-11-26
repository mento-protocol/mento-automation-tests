import { expect } from "@fixtures/common.fixture";
import { Token } from "@constants/token.constants";
import { suite } from "@helpers/suite/suite.helper";
import { AmountType } from "@services/types/swap.service.types";

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
          fromAmount: "0.0001",
        });
        expect
          .soft(
            Number(await web.swap.getAmountByType(AmountType.Out)),
            "swap-out amount is not calculated",
          )
          .toBeGreaterThan(0);
        await web.swap.start();
        await web.swap.confirm.finish(wallet);
        await web.swap.confirm.expectSuccessfulTransaction();
      },
    },
    {
      name: "Swap-out",
      testCaseId: "@T3c8db175",
      test: async ({ web, wallet }) => {
        await web.swap.fillForm({
          tokens: { from: Token.cEUR, to: Token.CELO },
          toAmount: "0.0001",
        });
        expect(
          Number(await web.swap.getAmountByType(AmountType.In)),
        ).toBeGreaterThan(0);
        await web.swap.start();
        await web.swap.confirm.finish(wallet);
        await web.swap.confirm.expectSuccessfulTransaction();
      },
    },
  ],
});
