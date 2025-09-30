import { TestTag } from "@constants/test.constants";
import { suite } from "@helpers/suite/suite.helper";
import { WalletName } from "@shared/web/connect-wallet-modal/connect-wallet-modal.service";
import { ProposalState } from "../../../../src/apps/governance/web/proposal-view/proposal-view.service";
import { expect } from "@fixtures/test.fixture";
import { executeTitleSuffix } from "@constants/index";

suite({
  name: "Proposal - Execute",
  tags: [TestTag.Regression, TestTag.Sequential],
  beforeEach: async ({ web }) => {
    await web.app.governance.main.connectWalletByName(WalletName.Metamask);
  },
  tests: [
    {
      name: "Queue for execution and execute a proposal",
      testCaseId: "",
      test: async ({ web, api }) => {
        const app = web.app.governance;
        const allProposals = await api.app.governance.common.getAllProposals();
        const foundProposal = await web.contract.governance.findProposalByState(
          allProposals,
          ProposalState.Succeeded,
          executeTitleSuffix,
        );

        await app.main.openProposalById(foundProposal.proposalId);
        await app.proposalView.page.verifyIsOpen();
        await app.proposalView.waitForProposalState(ProposalState.Succeeded);

        await app.proposalView.queueForExecution();
        await app.proposalView.waitForVetoPeriodEnd();
        await app.proposalView.execute();

        expect(await app.proposalView.getProposalState()).toBe(
          ProposalState.Executed,
        );
        expect(await app.proposalView.getVoteStatus()).toBe(
          "Proposal Executed",
        );
      },
    },
  ],
});
