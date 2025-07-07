import { expect } from "@fixtures/common/common.fixture";
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
  beforeEach: async ({ web }) => await web.main.runSwapTestPreconditions(),
  tests: [
    {
      name: `The 'Sell' input and USD amounts should have 4 decimals`,
      testCaseId: "",
      test: async ({ web }) => {
        await web.swap.fillForm({
          tokens: { sell: Token.cEUR, buy: Token.CELO },
          sellAmount: fiveDecimalsAmount,
        });

        const swapStageSellUsdAmount = await web.swap.getUsdAmountByType(
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
        await web.swap.proceedToConfirmation({
          shouldVerifyNoValidMedian: false,
        });

        const confirmStageSellUsdAmount =
          await web.swap.confirm.getUsdAmountByType(AmountType.Sell);
        expect
          .soft(
            primitiveHelper.number.hasMaxDecimalPlaces(
              confirmStageSellUsdAmount,
              expectedDecimals,
            ),
          )
          .toBeTruthy();
        expect(await web.swap.confirm.getAmountByType(AmountType.Sell)).toBe(
          fourDecimalsAmount,
        );
      },
    },
    {
      name: `The 'Buy' input and USD amounts should have 4 decimals`,
      testCaseId: "",
      test: async ({ web }) => {
        await web.swap.fillForm({
          tokens: { sell: Token.cEUR, buy: Token.CELO },
          buyAmount: fiveDecimalsAmount,
        });

        const swapStageBuyUsdAmount = await web.swap.getUsdAmountByType(
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

        await web.swap.proceedToConfirmation({
          shouldVerifyNoValidMedian: false,
        });

        const confirmStageBuyUsdAmount =
          await web.swap.confirm.getUsdAmountByType(AmountType.Buy);
        expect
          .soft(
            primitiveHelper.number.hasMaxDecimalPlaces(
              confirmStageBuyUsdAmount,
              expectedDecimals,
            ),
          )
          .toBeTruthy();
        expect(await web.swap.confirm.getAmountByType(AmountType.Buy)).toBe(
          fourDecimalsAmount,
        );
      },
    },
  ],
});
