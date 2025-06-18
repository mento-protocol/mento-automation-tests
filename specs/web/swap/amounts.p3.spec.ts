import { expect } from "@fixtures/common/common.fixture";
import { Token } from "@constants/token.constants";
import { suite } from "@helpers/suite/suite.helper";
import { AmountType } from "@services/index";
import { primitiveHelper } from "@helpers/primitive/primitive.helper";
import { timeouts } from "@constants/index";

const expectedDecimals = 4;
const fiveDecimalsAmount = "10.23456";
const fourDecimalsAmount = "10.2345";

suite({
  name: "Swap - Amounts",
  beforeEach: async ({ web }) => {
    await web.main.runSwapTestPreconditions();
  },
  tests: [
    {
      name: "Rates are equal on all the stages",
      testCaseId: "@T2332ee03",
      test: async ({ web }) => {
        await web.swap.fillForm({
          tokens: { sell: Token.cEUR, buy: Token.CELO },
          sellAmount: "0.0001",
        });
        expect(await web.swap.isRateThere()).toBeTruthy();
        const { beforeSwapRate, afterSwapRate } = await web.swap.swapInputs();
        expect(beforeSwapRate).not.toEqual(afterSwapRate);
        await web.swap.proceedToConfirmation();
        expect(afterSwapRate).toEqual(await web.swap.confirm.getRate());
      },
    },
    {
      name: "The 'Sell' input is auto-calculating when 'Buy' is filled`",
      testCaseId: "@T9906952e",
      test: async ({ web }) => {
        await web.swap.fillForm({
          tokens: { sell: Token.cEUR, buy: Token.CELO },
          buyAmount: "0.0001",
        });
        expect(await web.swap.isSellInputEmpty()).toBeFalsy();
      },
    },
    {
      name: `Use max balance using '${Token.CELO}' as 'Sell'`,
      testCaseId: "@Ta34f8bd6",
      test: async ({ web }) => {
        const maxBalance = (
          await web.main.getTokenBalanceByName(Token.CELO)
        ).toString();
        await web.swap.fillForm({
          tokens: { sell: Token.CELO, buy: Token.cUSD },
        });
        await web.swap.useFullBalance();
        expect(await web.swap.getSellTokenAmount()).toEqual(maxBalance);
        expect(await web.swap.isConsiderKeepNotificationThere()).toBeTruthy();
      },
    },
    {
      name: `Use max balance using anything as 'from' besides '${Token.CELO}'`,
      testCaseId: "@T80d4fbc3",
      test: async ({ web }) => {
        const maxBalance = (
          await web.main.getTokenBalanceByName(Token.cCHF)
        ).toString();
        await web.swap.fillForm({
          tokens: { sell: Token.cCHF, buy: Token.cUSD },
        });
        await web.swap.useFullBalance();
        expect(await web.swap.getSellTokenAmount()).toEqual(maxBalance);
        expect(await web.swap.isConsiderKeepNotificationThere()).toBeFalsy();
      },
    },
    {
      name: `The 'Sell' input and USD amounts should have 4 decimals`,
      testCaseId: "@",
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
            primitiveHelper.number.hasExactDecimalNumber(
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
            primitiveHelper.number.hasExactDecimalNumber(
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
      testCaseId: "@",
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
            primitiveHelper.number.hasExactDecimalNumber(
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
            primitiveHelper.number.hasExactDecimalNumber(
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
    {
      name: `Trading limit error is shown when the 'Sell' amount exceeds limit`,
      testCaseId: "@",
      test: async ({ web }) => {
        await web.swap.fillForm({
          tokens: { sell: Token.cEUR, buy: Token.CELO },
          sellAmount: "90000",
        });
        expect(
          await web.swap.waitForExceedsTradingLimitsValidation(timeouts.m),
        ).toBeTruthy();
      },
    },
    {
      name: `Trading limit error is shown when the 'Buy' amount exceeds limit`,
      testCaseId: "@",
      test: async ({ web }) => {
        await web.swap.fillForm({
          tokens: { sell: Token.cEUR, buy: Token.cUSD },
          buyAmount: "90000",
        });
        expect(
          await web.swap.waitForExceedsTradingLimitsValidation(timeouts.m),
        ).toBeTruthy();
      },
    },
  ],
});
