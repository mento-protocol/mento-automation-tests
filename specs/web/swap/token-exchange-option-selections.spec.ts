import { expect } from "@fixtures/common.fixture";
import { Token } from "@constants/token.constants";
import { suite } from "@helpers/suite/suite.helper";
import { Dropdown } from "@pageElements/dropdown";
import { ITokenDropdownOptions } from "@pageObjects/types/swap.po.types";
import { IExecution } from "@helpers/suite/suite.types";

const testCases = [
  {
    token: Token.CELO,
    exchangeOptions: [Token.cUSD, Token.cEUR, Token.cREAL, Token.eXOF],
    id: "@T61ff6eca",
  },
  {
    token: Token.cUSD,
    exchangeOptions: [
      Token.CELO,
      Token.USDC,
      Token.USDT,
      Token.axlUSDC,
      Token.cKES,
      Token.PUSO,
      Token.cCOP,
    ],
    id: "@T4cf1f159",
  },
  {
    token: Token.cEUR,
    exchangeOptions: [Token.CELO, Token.USDC, Token.axlUSDC, Token.axlEUROC],
    id: "@T55e5689d",
  },
  {
    token: Token.cREAL,
    exchangeOptions: [Token.CELO, Token.USDC, Token.axlUSDC],
    id: "@T1cdcec6e",
  },
  {
    token: Token.USDC,
    exchangeOptions: [Token.cUSD, Token.cEUR, Token.cREAL],
    id: "@T65b923f0",
  },
  {
    token: Token.USDT,
    exchangeOptions: [Token.cUSD],
    id: "@T1728aaf3",
  },
  {
    token: Token.axlUSDC,
    exchangeOptions: [Token.cUSD, Token.cEUR, Token.cREAL],
    id: "@T3842f1e6",
  },
  {
    token: Token.axlEUROC,
    exchangeOptions: [Token.cEUR, Token.eXOF],
    id: "@T1b2d5431",
  },
  {
    token: Token.eXOF,
    exchangeOptions: [Token.CELO, Token.axlEUROC],
    id: "@T8b44f3ea",
  },
  {
    token: Token.cKES,
    exchangeOptions: [Token.cUSD],
    id: "@Tdf1f8d60",
  },
  {
    token: Token.PUSO,
    exchangeOptions: [Token.cUSD],
    id: "@Td740bfbf",
  },
  {
    token: Token.cCOP,
    exchangeOptions: [Token.cUSD],
    id: "@T7a80e866",
  },
];

suite({
  name: "Swap - Token Exchange Options",
  beforeAll: async ({ web, wallet }) => {
    await web.main.openAppWithConnectedWallet(wallet);
  },
  afterEach: async ({ web }) => {
    await web.swap.browser.refresh();
  },
  tests: [
    {
      name: 'pre-defining a default selected token after changing the "From Token"',
      testCaseId: "@T093c401d",
      test: async ({ web }) => {
        await web.swap.selectTokens({ from: Token.axlEUROC });
        expect(await web.swap.getCurrentToTokenName()).toEqual(Token.cEUR);
      },
    },
    {
      name: "Swap token inputs",
      testCaseId: "@Td88a4d31",
      test: async ({ web }) => {
        await web.swap.selectTokens({ from: Token.cREAL, to: Token.CELO });
        await web.swap.swapInputs();
        expect(await web.swap.getCurrentFromTokenName()).toEqual(Token.CELO);
        expect(await web.swap.getCurrentToTokenName()).toEqual(Token.cREAL);
      },
    },
    ...testCases.map(testCase => {
      return {
        name: `from ${testCase.token} token`,
        testCaseId: testCase.id,
        test: async ({ web }: IExecution) => {
          await web.swap.selectTokens({ from: testCase.token });
          await web.swap.page.toTokenDropdown.click();
          await expectExchangeOptions(
            web.swap.page.toTokenDropdown,
            testCase.exchangeOptions,
          );
        },
      };
    }),
  ],
});

async function expectExchangeOptions(
  tokenDropdown: Dropdown<ITokenDropdownOptions>,
  exchangeOptions: Token[],
): Promise<void> {
  for (const exchangeOption of exchangeOptions) {
    expect
      .soft(
        await tokenDropdown.options[exchangeOption].isDisplayed(),
        `${exchangeOption} is not displayed`,
      )
      .toBeTruthy();
  }
}
