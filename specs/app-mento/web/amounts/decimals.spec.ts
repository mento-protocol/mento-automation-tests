import { expect } from "@fixtures/test.fixture";
import { Token } from "@constants/token.constants";
import { suite } from "@helpers/suite/suite.helper";
import { primitiveHelper } from "@helpers/primitive/primitive.helper";
import { TestTag } from "@constants/test.constants";
import { AmountType } from "../../../../src/apps/app-mento/web/swap/swap.service.types";

const expectedDecimals = 4;
const fiveDecimalsAmount = "10.23456";
const fourDecimalsAmount = "10.2345";

suite({
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
          tokens: { sell: Token.cCOP, buy: Token.CELO },
          sellAmount: fiveDecimalsAmount,
        });

        const swapStageSellUsdAmount = await app.swap.getUsdAmountByType(
          AmountType.Sell,
        );
        expect
          .soft(
            primitiveHelper.number.hasMaxDecimalPlaces(
              swapStageSellUsdAmount,
              expectedDecimals,
            ),
          )
          .toBeTruthy();
        await app.swap.proceedToConfirmation({
          shouldVerifyNoValidMedian: false,
        });

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
        expect(await app.swap.confirm.getAmountByType(AmountType.Sell)).toBe(
          fourDecimalsAmount,
        );
      },
    },
    {
      name: `The 'Buy' input and USD amounts should have 4 decimals`,
      testCaseId: "",
      test: async ({ web }) => {
        const app = web.app.appMento;
        await app.swap.fillForm({
          tokens: { sell: Token.cCOP, buy: Token.CELO },
          buyAmount: fiveDecimalsAmount,
        });

        const swapStageBuyUsdAmount = await app.swap.getUsdAmountByType(
          AmountType.Buy,
        );
        expect
          .soft(
            primitiveHelper.number.hasMaxDecimalPlaces(
              swapStageBuyUsdAmount,
              expectedDecimals,
            ),
          )
          .toBeTruthy();

        await app.swap.proceedToConfirmation({
          shouldVerifyNoValidMedian: false,
        });

        const confirmStageBuyUsdAmount =
          await app.swap.confirm.getUsdAmountByType(AmountType.Buy);
        expect
          .soft(
            primitiveHelper.number.hasMaxDecimalPlaces(
              confirmStageBuyUsdAmount,
              expectedDecimals,
            ),
          )
          .toBeTruthy();
        expect(await app.swap.confirm.getAmountByType(AmountType.Buy)).toBe(
          fourDecimalsAmount,
        );
      },
    },
  ],
});
