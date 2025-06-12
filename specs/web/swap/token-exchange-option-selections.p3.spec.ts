import { expect } from "@fixtures/common/common.fixture";
import { defaultSwapAmount, Token } from "@constants/token.constants";
import { suite } from "@helpers/suite/suite.helper";
import { WalletName } from "@services/index";

suite({
  name: "Swap - Token Exchange Options",
  tests: [
    {
      name: "Swap token inputs",
      testCaseId: "@Td88a4d31",
      test: async ({ web }) => {
        await web.main.connectWalletByName(WalletName.Metamask);
        await web.swap.fillForm({
          sellAmount: defaultSwapAmount,
          tokens: {
            from: Token.cREAL,
            to: Token.CELO,
            clicksOnTokenSelector: 1,
          },
        });
        await web.swap.swapInputs();
        expect(await web.swap.getCurrentFromTokenName()).toEqual(Token.CELO);
        expect(await web.swap.getCurrentToTokenName()).toEqual(Token.cREAL);
      },
    },
  ],
});
