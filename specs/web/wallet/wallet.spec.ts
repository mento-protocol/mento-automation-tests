import { expect } from "@fixtures/common.fixture";
import { suite } from "@helpers/suite/suite.helper";
import { Token } from "@constants/token.constants";

suite({
  name: "Connect available wallets",
  beforeAll: async ({ web, wallet }) => {
    await web.main.openAppWithConnectedWallet(wallet);
  },
  tests: [
    {
      name: "Connect metamask waller",
      test: async ({ web }) => {
        expect(await web.main.isWalletConnected());
      },
    },
  ],
});
