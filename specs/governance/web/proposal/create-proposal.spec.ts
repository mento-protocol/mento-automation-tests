import { TestTag } from "@constants/test.constants";
import { suite } from "@helpers/suite/suite.helper";
import { WalletName } from "@shared/web/connect-wallet-modal/connect-wallet-modal.service";
import { magicStrings } from "@constants/index";

suite({
  name: "Proposal - Create",
  tags: [TestTag.Regression, TestTag.Sequential, TestTag.Smoke],
  beforeEach: async ({ web }) => {
    await web.app.governance.main.connectWalletByName(WalletName.Metamask);
  },
  tests: [
    {
      name: "Create a valid proposal",
      testCaseId: "",
      test: async ({ web }) => {
        const app = web.app.governance;
        const proposalData = magicStrings.governance.generateProposalData();

        await app.main.openCreateProposalPage();
        await app.createProposal.createValid({
          title: proposalData.title,
          description: proposalData.description,
          executionCode: proposalData.executionCode,
        });
      },
    },
  ],
});
