import { testWalletAddresses, Token } from "@constants/token.constants";
import { testHelper } from "@helpers/test/test.helper";
import { IExecution } from "@helpers/test/test.types";
import { TestTag } from "@constants/test.constants";
import { envHelper } from "@helpers/env/env.helper";

const isFork = envHelper.isFork();
const swapAmount = "0.001";

const tests = [
  // USD₮
  {
    token: Token.USD_,
    testCases: [
      { token: Token.USDm, id: "T2511996c" },
      { token: Token.EURm },
      { token: Token.PHPm },
      { token: Token.XOFm },
      { token: Token.AUDm },
      { token: Token.CADm },
      { token: Token.ZARm },
      { token: Token.CHFm },
      { token: Token.JPYm },
      { token: Token.COPm },
      { token: Token.BRLm },
      { token: Token.GHSm },
      { token: Token.NGNm },
      { token: Token.KESm },
    ],
  },
  // KESm
  {
    token: Token.KESm,
    testCases: [
      { token: Token.USDm, id: "Tbe02fb8d" },
      { token: Token.PHPm },
      { token: Token.XOFm },
      { token: Token.AUDm },
      { token: Token.CADm },
      { token: Token.ZARm },
      { token: Token.CHFm },
      { token: Token.JPYm },
      { token: Token.COPm },
      { token: Token.BRLm },
      { token: Token.GHSm },
      { token: Token.NGNm },
    ],
  },
  {
    token: Token.PHPm,
    testCases: [
      { token: Token.USDm, id: "T7d8911a6" },
      { token: Token.XOFm },
      { token: Token.AUDm },
      { token: Token.CADm },
      { token: Token.ZARm },
      { token: Token.CHFm },
      { token: Token.JPYm },
      { token: Token.COPm },
      { token: Token.BRLm },
      { token: Token.GHSm },
      { token: Token.NGNm },
    ],
  },
  {
    token: Token.COPm,
    testCases: [
      { token: Token.USDm, id: "Ta2aa287f" },
      { token: Token.XOFm },
      { token: Token.AUDm },
      { token: Token.CADm },
      { token: Token.ZARm },
      { token: Token.CHFm },
      { token: Token.JPYm },
      { token: Token.BRLm },
      { token: Token.GHSm },
      { token: Token.NGNm },
    ],
  },
  // USDC
  {
    token: Token.USDC,
    testCases: [
      { token: Token.USDm, id: "Ta9f2be1e" },
      { token: Token.EURm },
      { token: Token.PHPm },
      { token: Token.XOFm },
      { token: Token.AUDm },
      { token: Token.CADm },
      { token: Token.ZARm },
      { token: Token.CHFm },
      { token: Token.JPYm },
      { token: Token.COPm },
      { token: Token.BRLm },
      { token: Token.GHSm },
      { token: Token.NGNm },
      { token: Token.KESm },
    ],
  },
  // axlUSDC
  {
    token: Token.axlUSDC,
    testCases: [
      { token: Token.USDm, id: "T635a15c9" },
      { token: Token.EURm },
      { token: Token.PHPm },
      { token: Token.XOFm },
      { token: Token.AUDm },
      { token: Token.CADm },
      { token: Token.ZARm },
      { token: Token.CHFm },
      { token: Token.JPYm },
      { token: Token.COPm },
      { token: Token.BRLm },
      { token: Token.GHSm },
      { token: Token.NGNm },
      { token: Token.KESm },
    ],
  },
  // GHSm
  {
    token: Token.GHSm,
    testCases: [
      { token: Token.USDm, id: "T8da32b9f" },
      { token: Token.XOFm },
      { token: Token.AUDm },
      { token: Token.CADm },
      { token: Token.ZARm },
      { token: Token.CHFm },
      { token: Token.JPYm },
      { token: Token.BRLm },
      { token: Token.NGNm },
    ],
  },
  // GBPm
  {
    token: Token.GBPm,
    testCases: [
      { token: Token.USDm, id: "T22f94bbb" },
      { token: Token.EURm },
      { token: Token.PHPm },
      { token: Token.XOFm },
      { token: Token.AUDm },
      { token: Token.CADm },
      { token: Token.ZARm },
      { token: Token.CHFm },
      { token: Token.JPYm },
      { token: Token.COPm },
      { token: Token.BRLm },
      { token: Token.GHSm },
      { token: Token.NGNm },
      { token: Token.KESm },
    ],
  },
  // EURm
  {
    token: Token.EURm,
    testCases: [
      { token: Token.USDm },
      { token: Token.GBPm },
      { token: Token.PHPm },
      { token: Token.XOFm },
      { token: Token.AUDm },
      { token: Token.CADm },
      { token: Token.ZARm },
      { token: Token.CHFm },
      { token: Token.JPYm },
      { token: Token.COPm },
      { token: Token.BRLm },
      { token: Token.GHSm },
      { token: Token.NGNm },
      { token: Token.KESm },
    ],
  },
  // ZARm
  {
    token: Token.ZARm,
    testCases: [
      { token: Token.USDm, id: "T4b1b444b" },
      { token: Token.XOFm },
      { token: Token.AUDm },
      { token: Token.CADm },
      { token: Token.CHFm },
      { token: Token.JPYm },
      { token: Token.BRLm },
      { token: Token.NGNm },
    ],
  },
  // CADm
  {
    token: Token.CADm,
    testCases: [
      { token: Token.USDm, id: "T0869d367" },
      { token: Token.XOFm },
      { token: Token.AUDm },
      { token: Token.CHFm },
      { token: Token.JPYm },
      { token: Token.BRLm },
      { token: Token.NGNm },
    ],
  },
  // AUDm
  {
    token: Token.AUDm,
    testCases: [
      { token: Token.USDm, id: "T1d46dc17" },
      { token: Token.XOFm },
      { token: Token.CHFm },
      { token: Token.JPYm },
      { token: Token.BRLm },
      { token: Token.NGNm },
    ],
  },
  // CHFm
  {
    token: Token.CHFm,
    testCases: [
      { token: Token.USDm, id: "Tc750f6e5" },
      { token: Token.XOFm },
      { token: Token.JPYm },
      { token: Token.BRLm },
      { token: Token.NGNm },
    ],
  },
  // NGNm
  {
    token: Token.NGNm,
    testCases: [
      { token: Token.USDm, id: "T280cb27f" },
      { token: Token.XOFm },
      { token: Token.JPYm },
      { token: Token.BRLm },
    ],
  },
  // JPYm
  {
    token: Token.JPYm,
    testCases: [
      { token: Token.USDm, id: "T36d94360" },
      { token: Token.XOFm },
      { token: Token.BRLm },
    ],
  },
];

testHelper.runSuite({
  name: "Swap - By token pairs",
  tags: [TestTag.Regression, TestTag.Sequential],
  beforeEach: async ({ web }) =>
    await web.app.appMento.main.runSwapTestPreconditions({ isFork }),
  tests: [
    ...tests.flatMap(test => {
      return test.testCases.map(testCase => {
        const sellToken = test.token;
        const buyToken = testCase.token;
        return {
          name: `${sellToken}/${buyToken}`,
          testCaseId: testCase.id,
          test: async ({ web, contractHelper }: IExecution) => {
            const app = web.app.appMento;
            const initialBalance =
              await contractHelper.governance.getBalanceByTokenSymbol({
                walletAddress: testWalletAddresses.main,
                tokenSymbol: buyToken,
              });
            await app.swap.fillForm({
              tokens: { sell: sellToken, buy: buyToken },
              sellAmount: swapAmount,
            });
            await app.swap.start();
            await app.main.expectUpdatedBalance({
              shouldIncrease: true,
              tokenSymbol: buyToken,
              initialBalance: initialBalance,
              walletAddress: testWalletAddresses.main,
            });
          },
        };
      });
    }),
  ],
});
