import { expect } from "@fixtures/common/common.fixture";
import { defaultSwapAmount, Token } from "@constants/token.constants";
import { suite } from "@helpers/suite/suite.helper";
import { IExecution } from "@helpers/suite/suite.types";
import { TestTag } from "@constants/test.constants";
import { Slippage } from "../../../../src/apps/app-mento/web/swap/swap.service.types";

const tokens = {
  from: Token.cEUR,
  to: Token.CELO,
};

const testCases = [
  {
    name: `default (${tokens.from}/${tokens.to})`,
    slippage: undefined,
    id: "T751161b4",
    disable: {
      reason: "Default slippage is set by default for all swap tests",
    },
  },
  {
    name: `minimal (${tokens.from}/${tokens.to})`,
    slippage: Slippage["0.5%"],
    id: "T0046ec8d",
  },
  {
    name: `max (${tokens.from}/${tokens.to})`,
    slippage: Slippage["1.5%"],
    id: "Tb9505e3a",
  },
];

suite({
  name: "Swap - With custom slippage",
  tags: [TestTag.Regression, TestTag.Sequential],
  beforeEach: async ({ web }) => {
    await web.main.runSwapTestPreconditions();
  },
  tests: [
    ...testCases.map(testCase => {
      return {
        name: `perform with ${testCase.name} slippage`,
        testCaseId: testCase.id,
        disable: testCase?.disable,
        test: async ({ web }: IExecution) => {
          const initialBalance = await web.main.getTokenBalanceByName(
            tokens.to,
          );
          await web.swap.fillForm({
            slippage: testCase.slippage,
            tokens: {
              sell: tokens.from,
              buy: tokens.to,
              clicksOnSellTokenButton: 1,
            },
            sellAmount: defaultSwapAmount,
          });
          expect.soft(await web.swap.isRateThere()).toBeTruthy();
          await web.swap.start();
          await web.main.expectIncreasedBalance({
            tokenName: tokens.to,
            initialBalance,
          });
        },
      };
    }),
  ],
});
