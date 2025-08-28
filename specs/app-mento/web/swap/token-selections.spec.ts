import { expect } from "@fixtures/test.fixture";
import { defaultSwapAmount, Token } from "@constants/token.constants";
import { suite } from "@helpers/suite/suite.helper";
import { IExecution } from "@helpers/suite/suite.types";
import { TestTag } from "@constants/test.constants";
import { testSuites } from "@constants/test-suites.constant";
import { WalletName } from "../../../../src/apps/shared/web/connect-wallet-modal/connect-wallet-modal.service";
import { waiterHelper } from "@helpers/waiter/waiter.helper";

const testCases = testSuites.swap.tokenSelections;

suite({
  name: "Swap - Token selections",
  tags: [TestTag.Regression, TestTag.Parallel],
  tests: [
    {
      name: "Swap token inputs",
      testCaseId: "Td88a4d31",
      test: async ({ web }) => {
        const app = web.app.appMento;
        await app.swap.fillForm({
          sellAmount: defaultSwapAmount,
          waitForLoadedRate: false,
          tokens: {
            sell: Token.cREAL,
            buy: Token.CELO,
            clicksOnSellTokenButton: 1,
          },
        });
        await app.swap.swapInputs({ shouldReturnRates: false });
        expect(await app.swap.getCurrentSellTokenName()).toEqual(Token.CELO);
        expect(await app.swap.getCurrentBuyTokenName()).toEqual(Token.cREAL);
      },
    },
    {
      name: "Select an invalid pair for 'Sell' token",
      testCaseId: "Td88a4d31",
      test: async ({ web }) => {
        const app = web.app.appMento;
        await app.main.connectWalletByName(WalletName.Metamask);
        await app.swap.fillForm({
          waitForLoadedRate: false,
          tokens: {
            sell: Token.cREAL,
            buy: Token.axlEUROC,
            clicksOnSellTokenButton: 1,
          },
        });
        expect
          .soft(await app.swap.isTokenDropdownInEmptyState("sell"))
          .toEqual(true);
        expect
          .soft(await app.swap.getCurrentBuyTokenName())
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
        const app = web.app.appMento;
        await app.main.connectWalletByName(WalletName.Metamask);
        await app.swap.fillForm({
          waitForLoadedRate: false,
          isSellTokenFirst: false,
          tokens: {
            sell: Token.cREAL,
            buy: Token.axlEUROC,
            clicksOnSellTokenButton: 1,
          },
        });
        expect
          .soft(await app.swap.isTokenDropdownInEmptyState("buy"))
          .toEqual(true);
        expect
          .soft(await app.swap.getCurrentSellTokenName())
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
        const app = web.app.appMento;
        await app.swap.selectToken({
          token: Token.cREAL,
          tokenDropdown: "sell",
        });
        await app.swap.openSelectTokenModal({
          tokenType: "buy",
        });
        await app.swap.selectTokenModalPage.tokens.axlEUROC.hover();
        expect(await app.swap.getInvalidPairTooltipText()).toEqual(
          "Invalid pair",
        );
      },
    },
    ...testCases.map(testCase => {
      return {
        name: `"${testCase.token}" token selections`,
        testCaseId: testCase.id,
        test: async ({ web }: IExecution) => {
          const app = web.app.appMento;
          if (testCase.token === Token.cUSD) {
            await app.swap.swapInputs({ shouldReturnRates: false });
          }
          await app.swap.fillForm({
            tokens: { sell: testCase.token },
            waitForLoadedRate: false,
            clicksOnSellTokenButton: 1,
          });
          await app.swap.openSelectTokenModal({
            tokenType: "buy",
          });
          await waiterHelper.sleep(2000, {
            sleepReason: "To get all tokens set",
          });
          const validTokens =
            await app.swap.selectTokenModalPage.getAllValidTokenNames();
          expect.soft(validTokens).toEqual(testCase.validTokens);
          const invalidTokens =
            await app.swap.selectTokenModalPage.getAllInvalidTokenNames();
          expect(invalidTokens).toEqual(testCase.invalidTokens);
        },
      };
    }),
  ],
});
