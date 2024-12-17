import { expect } from "@fixtures/common/common.fixture";
import { defaultSwapAmount, Token } from "@constants/token.constants";
import { suite } from "@helpers/suite/suite.helper";
import { Slippage } from "@services/index";
import { IExecution } from "@helpers/suite/suite.types";

const toToken = Token.CELO;

const testCases = [
  {
    name: "default",
    slippage: undefined,
    id: "@T751161b4",
    disable: {
      reason: "Default slippage is set by default for all swap tests",
    },
  },
  {
    name: "minimal",
    slippage: Slippage["0.5%"],
    id: "@T0046ec8d",
  },
  {
    name: "max",
    slippage: Slippage["1.5%"],
    id: "@Tb9505e3a",
  },
];

suite({
  name: "Swap - With custom slippage",
  beforeAll: async ({ web, wallet }) => {
    await web.main.openAppWithConnectedWallet(wallet);
  },
  afterEach: async ({ web }) => {
    await web.swap.browser.refresh();
  },
  tests: [
    ...testCases.map(testCase => {
      return {
        name: `perform with ${testCase.name} slippage`,
        testCaseId: testCase.id,
        disable: testCase?.disable,
        test: async ({ web, wallet }: IExecution) => {
          await web.swap.fillForm({
            slippage: testCase.slippage,
            tokens: { from: Token.cEUR, to: toToken },
            fromAmount: defaultSwapAmount,
          });
          const initialBalance = await web.main.getTokenBalanceByName(toToken);
          expect.soft(await web.swap.isCurrentPriceThere()).toBeTruthy();
          await web.swap.start();
          await web.swap.confirm.finish(wallet);
          await web.swap.confirm.expectSuccessfulNotifications();
          await web.swap.confirm.expectChangedBalance({
            currentBalance: await web.main.getTokenBalanceByName(toToken),
            initialBalance,
          });
        },
      };
    }),
  ],
});
