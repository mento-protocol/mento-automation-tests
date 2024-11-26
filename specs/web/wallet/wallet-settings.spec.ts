import { expect } from "@fixtures/common.fixture";
import { suite } from "@helpers/suite/suite.helper";
import { WalletName } from "@services/connect-wallet-modal.service";

suite({
  name: "Wallet Settings",
  beforeAll: async ({ web, wallet }) => {
    await web.main.openAppWithConnectedWallet(wallet);
  },
  tests: [
    {
      name: "Disconnect Wallet",
      testCaseId: "",
      test: async ({}) => {},
    },
    {
      name: "Copy address",
      testCaseId: "",
      test: async ({}) => {},
    },
    {
      name: "Change network to Celo",
      testCaseId: "",
      test: async ({}) => {},
    },
  ],
});
