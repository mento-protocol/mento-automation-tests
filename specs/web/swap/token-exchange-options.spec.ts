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
  },
  {
    token: Token.cEUR,
    exchangeOptions: [Token.CELO, Token.USDC, Token.axlUSDC, Token.axlEUROC],
  },
  {
    token: Token.cREAL,
    exchangeOptions: [Token.CELO, Token.USDC, Token.axlUSDC],
  },
  {
    token: Token.USDC,
    exchangeOptions: [Token.cUSD, Token.cEUR, Token.cREAL],
  },
  {
    token: Token.USDT,
    exchangeOptions: [Token.cUSD],
  },
  {
    token: Token.axlUSDC,
    exchangeOptions: [Token.cUSD, Token.cEUR, Token.cREAL],
  },
  {
    token: Token.axlEUROC,
    exchangeOptions: [Token.cEUR, Token.eXOF],
  },
  {
    token: Token.eXOF,
    exchangeOptions: [Token.CELO, Token.axlEUROC],
  },
  {
    token: Token.cKES,
    exchangeOptions: [Token.cUSD],
  },
  {
    token: Token.PUSO,
    exchangeOptions: [Token.cUSD],
  },
  {
    token: Token.cCOP,
    exchangeOptions: [Token.cUSD],
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
      test: async ({ web }) => {
        await web.swap.selectTokens({ from: Token.axlEUROC });
        expect(await web.swap.getCurrentToTokenName()).toEqual(Token.cEUR);
      },
    },
    ...testCases.map(testCase => {
      return {
        name: `from ${testCase.token} token`,
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
