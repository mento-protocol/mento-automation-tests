import { expect } from "@fixtures/common/common.fixture";
import { defaultSwapAmount, Token } from "@constants/token.constants";
import { suite } from "@helpers/suite/suite.helper";
import { IExecution } from "@helpers/suite/suite.types";
import { TestTag } from "@constants/test.constants";
import { testSuites } from "@constants/test-suites.constant";
import { WalletName } from "../../../../src/apps/shared/web/connect-wallet-modal/connect-wallet-modal.service";

const testCases = testSuites.swap.tokenSelections;

suite({
  name: "Swap - Token selections",
  tags: [TestTag.Regression, TestTag.Parallel],
  tests: [
    {
      name: "Swap token inputs",
      testCaseId: "Td88a4d31",
      test: async ({ web }) => {
        await web.swap.fillForm({
          sellAmount: defaultSwapAmount,
          waitForLoadedRate: false,
          tokens: {
            sell: Token.cREAL,
            buy: Token.CELO,
            clicksOnSellTokenButton: 1,
          },
        });
        await web.swap.swapInputs({ shouldReturnRates: false });
        expect(await web.swap.getCurrentSellTokenName()).toEqual(Token.CELO);
        expect(await web.swap.getCurrentBuyTokenName()).toEqual(Token.cREAL);
      },
    },
    {
      name: "Select an invalid pair for 'Sell' token",
      testCaseId: "Td88a4d31",
      test: async ({ web }) => {
        await web.main.connectWalletByName(WalletName.Metamask);
        await web.swap.fillForm({
          waitForLoadedRate: false,
          tokens: {
            sell: Token.cREAL,
            buy: Token.axlEUROC,
            clicksOnSellTokenButton: 1,
          },
        });
        expect
          .soft(await web.swap.isTokenDropdownInEmptyState("sell"))
          .toEqual(true);
        expect
          .soft(await web.swap.getCurrentBuyTokenName())
          .toEqual(Token.axlEUROC);
        // TODO: Investigate why this assertion is failing when it's displayed
        // expect(await web.swap.page.selectTokenToBuyLabel.isDisplayed()).toEqual(
        //   true,
        // );
      },
    },
    {
      name: "Select an invalid pair for 'Buy' token",
      testCaseId: "Td88a4d31",
      test: async ({ web }) => {
        await web.main.connectWalletByName(WalletName.Metamask);
        await web.swap.fillForm({
          waitForLoadedRate: false,
          isSellTokenFirst: false,
          tokens: {
            sell: Token.cREAL,
            buy: Token.axlEUROC,
            clicksOnSellTokenButton: 1,
          },
        });
        expect
          .soft(await web.swap.isTokenDropdownInEmptyState("buy"))
          .toEqual(true);
        expect
          .soft(await web.swap.getCurrentSellTokenName())
          .toEqual(Token.cREAL);
        // TODO: Investigate why this assertion is failing when it's displayed
        // expect(
        //   await web.swap.page.selectTokenToSellLabel.isDisplayed(),
        // ).toEqual(true);
      },
    },
    {
      name: "Hover over invalid pair tooltip",
      testCaseId: "Td88a4d31",
      test: async ({ web }) => {
        await web.swap.selectToken({
          token: Token.cREAL,
          tokenDropdown: "sell",
        });
        await web.swap.openSelectTokenModal({
          tokenType: "buy",
        });
        await web.swap.selectTokenModalPage.tokens.axlEUROC.hover();
        expect(await web.swap.getInvalidPairTooltipText()).toEqual(
          "Invalid pair",
        );
      },
    },
    ...testCases.map(testCase => {
      return {
        name: `"${testCase.token}" token`,
        testCaseId: testCase.id,
        test: async ({ web }: IExecution) => {
          if (testCase.token === Token.cUSD) {
            await web.swap.swapInputs({ shouldReturnRates: false });
          }
          await web.swap.fillForm({
            tokens: { sell: testCase.token },
            waitForLoadedRate: false,
            clicksOnSellTokenButton: 1,
          });
          await web.swap.openSelectTokenModal({
            tokenType: "buy",
          });
          const validTokens =
            await web.swap.selectTokenModalPage.getAllValidTokenNames();
          expect.soft(validTokens).toEqual(testCase.expectedValidTokens);
          const invalidTokens =
            await web.swap.selectTokenModalPage.getAllInvalidTokenNames();
          expect(invalidTokens).toEqual(testCase.expectedInvalidTokens);
        },
      };
    }),
  ],
});
