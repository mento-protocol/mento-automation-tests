import { expect } from "@fixtures/common.fixture";
import { suite } from "@helpers/suite/suite.helper";

suite({
  name: "Connect Wallet",
  beforeAll: async ({ web, wallet }) => {
    await web.main.openAppWithConnectedWallet(wallet);
  },
  tests: [
    {
      name: "Connect the Metamask wallet",
      testCaseId: "@Tf302ddd6",
      test: async ({ web }) => {
        expect(await web.main.isWalletConnected()).toBeTruthy();
      },
    },
  ],
});
