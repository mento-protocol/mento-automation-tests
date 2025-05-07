import { expect } from "@fixtures/common/common.fixture";
import { suite } from "@helpers/suite/suite.helper";
import { WalletName } from "@services/index";

suite({
  name: "Connect Wallet",
  tests: [
    {
      name: "Connect Metamask wallet",
      testCaseId: "@Tf302ddd6",
      test: async ({ web }) => {
        await web.main.connectWalletByName(WalletName.Metamask);
        expect(await web.main.isWalletConnected()).toBeFalsy();
      },
    },
  ],
});
