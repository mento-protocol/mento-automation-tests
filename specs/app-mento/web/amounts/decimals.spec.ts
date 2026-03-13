import { expect } from "@fixtures/test.fixture";
import { primitiveHelper } from "@helpers/primitive/primitive.helper";
import { TestTag } from "@constants/test.constants";
import { AmountType } from "../../../../src/apps/app-mento/web/swap/swap.service.types";
import { testHelper } from "@helpers/test/test.helper";

const expectedDecimals = 4;
const sellAmount = "0.1";

testHelper.runSuite({
  name: "Swap - Amount Decimals",
  tags: [TestTag.Regression, TestTag.Sequential, TestTag.Smoke],
  beforeEach: async ({ web }) =>
    await web.app.appMento.main.runSwapTestPreconditions(),
  tests: [
    {
      name: `The 'Sell' input and USD amounts should have 4 decimals`,
      testCaseId: "",
      test: async ({ web }) => {
        const app = web.app.appMento;
        await app.swap.fillForm({
          sellAmount: sellAmount,
        });

        const swapStageSellUsdAmount = await app.swap.getUsdAmountByType(
          AmountType.Sell,
        );
        const buyAmount = await app.swap.getAmountByType(AmountType.Buy);
        expect
          .soft(
            primitiveHelper.number.hasMaxDecimalPlaces(
              swapStageSellUsdAmount,
              expectedDecimals,
            ),
          )
          .toBeTruthy();
        await app.swap.proceedToConfirmation();

        const confirmStageSellUsdAmount =
          await app.swap.confirm.getUsdAmountByType(AmountType.Sell);
        expect
          .soft(
            primitiveHelper.number.hasMaxDecimalPlaces(
              confirmStageSellUsdAmount,
              expectedDecimals,
            ),
          )
          .toBeTruthy();
        expect
          .soft(await app.swap.confirm.getAmountByType(AmountType.Sell))
          .toBe(sellAmount);
        expect(await app.swap.confirm.getAmountByType(AmountType.Buy)).toBe(
          buyAmount,
        );
      },
    },
  ],
});
