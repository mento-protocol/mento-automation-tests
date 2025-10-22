import { TestTag } from "@constants/test.constants";
import { testWalletAddresses } from "@constants/token.constants";
import { suite } from "@helpers/suite/suite.helper";
import { TokenSymbol } from "@constants/token.constants";
import { WalletName } from "@shared/web/connect-wallet-modal/connect-wallet-modal.service";
import { IExecution } from "@helpers/suite/suite.types";

const testCases = [
  {
    sellToken: TokenSymbol.cUSD,
    buyToken: TokenSymbol.USDC,
  },
  {
    sellToken: TokenSymbol.CELO,
    buyToken: TokenSymbol.cEUR,
  },
];

suite({
  name: "Swap - By token pairs",
  tags: [TestTag.Regression, TestTag.Sequential, TestTag.Smoke],
  beforeEach: async ({ web }) =>
    await web.app.squidRouter.main.connectWalletByName(WalletName.Metamask),
  tests: [
    ...testCases.map(testCase => {
      return {
        name: `from ${testCase.sellToken} to ${testCase.buyToken}`,
        testCaseId: "",
        test: async ({ web }: IExecution) => {
          const app = web.app.squidRouter;
          const { sellToken, buyToken } = testCase;

          const initialSellBalance = await web.contract.governance.getBalance({
            walletAddress: testWalletAddresses.main,
            tokenSymbol: sellToken,
          });
          const initialBuyBalance = await web.contract.governance.getBalance({
            walletAddress: testWalletAddresses.main,
            tokenSymbol: buyToken,
          });

          await app.swap.process({
            sellToken,
            buyToken,
            isSellAmount: true,
            amount: "0.001",
          });
          await app.swap.expectUpdatedBalance({
            shouldIncrease: false,
            tokenSymbol: sellToken,
            initialBalance: initialSellBalance,
            walletAddress: testWalletAddresses.main,
          });
          await app.swap.expectUpdatedBalance({
            shouldIncrease: true,
            tokenSymbol: buyToken,
            initialBalance: initialBuyBalance,
            walletAddress: testWalletAddresses.main,
          });
        },
      };
    }),
  ],
});
