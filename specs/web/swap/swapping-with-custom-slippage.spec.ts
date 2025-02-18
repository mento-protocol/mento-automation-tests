import { expect } from "@fixtures/common/common.fixture";
import { defaultSwapAmount, Token } from "@constants/token.constants";
import { suite } from "@helpers/suite/suite.helper";
import { Network, Slippage, WalletName } from "@services/index";
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
  beforeEach: async ({ web }) => {
    await web.main.connectWalletByName(WalletName.Metamask);
    await web.main.switchNetwork({
      networkName: Network.Alfajores,
      shouldOpenSettings: true,
    });
    await web.main.waitForBalanceToLoad();
  },
  tests: [
    ...testCases.map(testCase => {
      return {
        name: `perform with ${testCase.name} slippage`,
        testCaseId: testCase.id,
        disable: testCase?.disable,
        test: async ({ web }: IExecution) => {
          const initialBalance = await web.main.getTokenBalanceByName(toToken);
          await web.swap.fillForm({
            slippage: testCase.slippage,
            tokens: { from: Token.cEUR, to: toToken },
            fromAmount: defaultSwapAmount,
          });
          expect.soft(await web.swap.isCurrentPriceThere()).toBeTruthy();
          await web.swap.start();
          await web.swap.confirm.process();
          await web.main.expectIncreasedBalance({
            tokenName: toToken,
            initialBalance,
          });
        },
      };
    }),
  ],
});
