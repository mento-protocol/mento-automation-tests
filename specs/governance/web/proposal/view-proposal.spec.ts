import { TestTag } from "@constants/test.constants";
import { suite } from "@helpers/suite/suite.helper";
import { WalletName } from "@shared/web/connect-wallet-modal/connect-wallet-modal.service";
import { expect } from "@fixtures/test.fixture";
import { magicStrings } from "@constants/index";

suite({
  name: "Proposal - View",
  tags: [TestTag.Regression, TestTag.Sequential, TestTag.Smoke],
  beforeEach: async ({ web }) => {
    await web.app.governance.main.connectWalletByName(WalletName.Metamask);
  },
  tests: [
    {
      name: "View newly created proposal",
      testCaseId: "",
      test: async ({ web }) => {
        const app = web.app.governance;
        const { proposalData } = magicStrings.governance;

        const result = await web.contractHelper.governance.createProposal(
          proposalData,
        );
        // TODO: remove this after testing
        console.info({ result });

        expect(result.success).toBe(true);
        expect(result.proposalId).toBeTruthy();
        expect(result.error).toBeUndefined();

        await app.main.isProposalThereByTitle(proposalData.title);
      },
    },
  ],
});
