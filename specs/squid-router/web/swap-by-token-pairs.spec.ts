import { TestTag } from "@constants/test.constants";
import { testWalletAddresses } from "@constants/token.constants";
import { suite } from "@helpers/suite/suite.helper";
import { TokenSymbol } from "@constants/token.constants";
import { WalletName } from "@shared/web/connect-wallet-modal/connect-wallet-modal.service";
import { IExecution } from "@helpers/suite/suite.types";

const testCases = [
  // CELO
  {
    sellToken: TokenSymbol.CELO,
    buyToken: TokenSymbol.cUSD,
  },
  // cUSD
  {
    sellToken: TokenSymbol.cUSD,
    buyToken: TokenSymbol.cEUR,
  },
  {
    sellToken: TokenSymbol.cREAL,
    buyToken: TokenSymbol.cUSD,
  },

  // USDT
  {
    sellToken: TokenSymbol.USDT,
    buyToken: TokenSymbol.cUSD,
    disable: { reason: "Cannot get USDT address by mento sdk" },
  },
  // cKES
  {
    sellToken: TokenSymbol.cKES,
    buyToken: TokenSymbol.cUSD,
  },
  // PUSO
  {
    sellToken: TokenSymbol.PUSO,
    buyToken: TokenSymbol.cUSD,
  },
  // cCOP
  {
    sellToken: TokenSymbol.cCOP,
    buyToken: TokenSymbol.cUSD,
  },
  // eXOF
  {
    sellToken: TokenSymbol.eXOF,
    buyToken: TokenSymbol.cUSD,
    disable: { reason: "No eXOF token" },
  },
  // USDC
  {
    sellToken: TokenSymbol.USDC,
    buyToken: TokenSymbol.cEUR,
  },
  // cGHS
  {
    sellToken: TokenSymbol.cGHS,
    buyToken: TokenSymbol.cUSD,
  },
  // cGBP
  {
    sellToken: TokenSymbol.cGBP,
    buyToken: TokenSymbol.cUSD,
  },
  // cAUD
  {
    sellToken: TokenSymbol.cAUD,
    buyToken: TokenSymbol.cUSD,
  },
  // cCHF
  {
    sellToken: TokenSymbol.cCHF,
    buyToken: TokenSymbol.cUSD,
  },
  // cJPY
  {
    sellToken: TokenSymbol.cJPY,
    buyToken: TokenSymbol.cUSD,
  },
  // cNGN
  {
    sellToken: TokenSymbol.cNGN,
    buyToken: TokenSymbol.cUSD,
  },
];

suite({
  name: "Swap - By token pairs",
  tags: [TestTag.Regression],
  beforeEach: async ({ web }) =>
    await web.app.squidRouter.main.connectWalletByName(WalletName.Metamask),
  tests: [
    ...testCases.map(testCase => {
      return {
        name: `from ${testCase.sellToken} to ${testCase.buyToken}`,
        testCaseId: "",
        disable: testCase?.disable,
        test: async ({ web }: IExecution) => {
          const app = web.app.squidRouter;
          const { sellToken, buyToken } = testCase;

          const initialSellBalance =
            await web.contract.governance.getBalanceByTokenSymbol({
              walletAddress: testWalletAddresses.main,
              tokenSymbol: sellToken,
            });
          const initialBuyBalance =
            await web.contract.governance.getBalanceByTokenSymbol({
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
