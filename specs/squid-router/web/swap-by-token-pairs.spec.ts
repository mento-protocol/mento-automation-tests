import { TestTag } from "@constants/test.constants";
import { testWalletAddresses } from "@constants/token.constants";
import { testHelper } from "@helpers/test/test.helper";
import { Token } from "@constants/token.constants";
import { WalletName } from "@shared/web/connect-wallet-modal/connect-wallet-modal.service";
import { IExecution } from "@helpers/test/test.types";

const testCases = [
  // CELO
  {
    sellToken: Token.CELO,
    buyToken: Token.USDm,
  },
  // USDm
  {
    sellToken: Token.USDm,
    buyToken: Token.EURm,
  },
  {
    sellToken: Token.BRLm,
    buyToken: Token.USDm,
  },

  // USDT
  {
    sellToken: Token["USD₮"],
    buyToken: Token.USDm,
    disable: { reason: "Cannot get USDT address by mento sdk" },
  },
  // KESm
  {
    sellToken: Token.KESm,
    buyToken: Token.USDm,
  },
  // PHPm
  {
    sellToken: Token.PHPm,
    buyToken: Token.USDm,
  },
  // COPm
  {
    sellToken: Token.COPm,
    buyToken: Token.USDm,
  },
  // XOFm
  {
    sellToken: Token.XOFm,
    buyToken: Token.USDm,
  },
  // USDC
  {
    sellToken: Token.USDC,
    buyToken: Token.EURm,
  },
  // GHSm
  {
    sellToken: Token.GHSm,
    buyToken: Token.USDm,
  },
  // GBPm
  {
    sellToken: Token.GBPm,
    buyToken: Token.USDm,
  },
  // AUDm
  {
    sellToken: Token.AUDm,
    buyToken: Token.USDm,
  },
  // CHFm
  {
    sellToken: Token.CHFm,
    buyToken: Token.USDm,
  },
  // JPYm
  {
    sellToken: Token.JPYm,
    buyToken: Token.USDm,
  },
  // NGNm
  {
    sellToken: Token.NGNm,
    buyToken: Token.USDm,
    amount: "0.1",
  },
];

testHelper.runSuite({
  name: "Swap - By token pairs",
  tags: [TestTag.Regression],
  beforeEach: async ({ web }) =>
    await web.app.squidRouter.main.connectWalletByName(WalletName.Metamask),
  tests: [
    ...testCases.map(testCase => {
      return {
        name: `${testCase.sellToken}/${testCase.buyToken}`,
        testCaseId: "",
        disable: testCase?.disable,
        test: async ({ web }: IExecution) => {
          const app = web.app.squidRouter;
          const { sellToken, buyToken } = testCase;

          const initialSellBalance =
            await web.contract.governance.getRawBalanceByTokenSymbol({
              walletAddress: testWalletAddresses.main,
              tokenSymbol: sellToken,
            });
          const initialBuyBalance =
            await web.contract.governance.getRawBalanceByTokenSymbol({
              walletAddress: testWalletAddresses.main,
              tokenSymbol: buyToken,
            });

          await app.swap.process({
            sellToken,
            buyToken,
            isSellAmount: true,
            amount: testCase.amount || "0.001",
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
