import { TestTag } from "@constants/test.constants";
import { suite } from "@helpers/suite/suite.helper";
import { WalletName } from "@shared/web/connect-wallet-modal/connect-wallet-modal.service";
import { ProposalState } from "../../../../src/apps/governance/web/proposal-view/proposal-view.service";

const id = Date.now();
const proposal = {
  title: `[${id}] Automation-Proposal`,
  description: `[${id}] Automation-Proposal-Description`,
  executionCode: [
    {
      address: "0x1230000000000000000000000000000000000000",
      value: 1,
      data: "0x123",
    },
  ],
};

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
        await app.main.openCreateProposalPage();
        await app.createProposal.createValid({
          title: proposal.title,
          description: proposal.description,
          executionCode: proposal.executionCode,
        });
        await app.proposalView.expectProposal({
          title: proposal.title,
          description: proposal.description,
          state: ProposalState.Active,
        });
      },
    },
  ],
});
