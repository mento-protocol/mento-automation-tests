import { TestTag } from "@constants/test.constants";
import { suite } from "@helpers/suite/suite.helper";
import { WalletName } from "@shared/web/connect-wallet-modal/connect-wallet-modal.service";
import { magicStrings } from "@constants/index";
import { ProposalState } from "../../../../src/apps/governance/web/proposal-view/proposal-view.service";
import { expect } from "@fixtures/test.fixture";

suite({
  name: "Proposal - Execute",
  tags: [TestTag.Regression, TestTag.Sequential, TestTag.Smoke],
  beforeEach: async ({ web, api }) => {
    await web.app.governance.main.connectWalletByName(WalletName.Metamask);
  },
  tests: [
    {
      name: "Execute a proposal",
      testCaseId: "",
      test: async ({ web, api }) => {
        const app = web.app.governance;
        const allProposals = await api.app.governance.common.getAllProposals();
        const foundProposal = await web.contract.governance.findProposalByState(
          allProposals,
          ProposalState.Queued,
        );
        await app.main.openProposalById(foundProposal.proposalId);
        await app.main.browser.pause();
        await app.proposalView.page.verifyIsOpen();
        expect(await app.proposalView.getProposalState()).toBe(
          ProposalState.Succeeded,
        );
        await app.proposalView.queueForExecution();
      },
    },
  ],
});
