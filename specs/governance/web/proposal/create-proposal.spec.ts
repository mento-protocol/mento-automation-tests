import { TestTag } from "@constants/test.constants";
import { expect } from "@fixtures/test.fixture";
import { suite } from "@helpers/suite/suite.helper";
import { WalletName } from "../../../../src/apps/shared/web/connect-wallet-modal/connect-wallet-modal.service";
import { ProposalState } from "../../../../src/apps/governance/web/proposal-view/proposal-view.service";

const proposalTitle = `[${Date.now()}] Automation-Proposal`;

suite({
  name: "Proposal - Create",
  tags: [TestTag.Regression, TestTag.Parallel, TestTag.Smoke],
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
        await app.createProposal.createValid({ title: proposalTitle });
        await app.createProposal.page.verifyIsClosed();
        await app.proposalView.page.verifyIsOpen();
        expect
          .soft(await app.proposalView.getProposalTitle())
          .toBe(proposalTitle);
        await app.proposalView.waitForLoadedVotingInfo();
        expect(await app.proposalView.getProposalState()).toBe(
          ProposalState.Active,
        );
      },
    },
  ],
});
