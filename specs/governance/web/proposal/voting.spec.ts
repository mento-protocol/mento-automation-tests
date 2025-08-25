import { magicStrings, TestTag, timeouts } from "@constants/index";
import { suite } from "@helpers/suite/suite.helper";
import { WalletName } from "@shared/web/connect-wallet-modal/connect-wallet-modal.service";
import {
  ProposalState,
  Vote,
} from "../../../../src/apps/governance/web/proposal-view/proposal-view.service";
import { expect } from "@fixtures/test.fixture";

const testCases = [
  {
    name: "'Yes' successfully",
    vote: Vote.Yes,
    timeout: timeouts.minute * 6,
    tags: [],
  },
  {
    name: "'No' successfully",
    vote: Vote.No,
    tags: [TestTag.Smoke],
  },
  {
    name: "'Abstain' successfully",
    vote: Vote.Abstain,
    tags: [TestTag.Smoke],
  },
];

suite({
  name: "Proposal - Voting",
  tags: [TestTag.Regression, TestTag.Sequential],
  beforeEach: async ({ web }) => {
    const app = web.app.governance;
    const proposalData = magicStrings.governance.generateProposalData();

    await app.main.connectWalletByName(WalletName.Metamask);
    await web.contract.governance.createProposal(proposalData);
    // TODO: Use the navigateToAppPage method once there's a correct proposalId gotten
    await app.main.openProposalByTitle(proposalData.title);
  },
  tests: testCases.map(({ name, vote, timeout, tags }) => ({
    name,
    testCaseId: "",
    timeout,
    tags,
    test: async ({ web }) => {
      const app = web.app.governance;

      await app.proposalView.vote(vote);
      await app.proposalView.expectVote(vote);

      if (name === testCases[0].name) {
        await app.proposalView.waitForProposalState(
          ProposalState.Succeeded,
          timeout,
        );
        expect(await app.proposalView.getProposalState()).toBe(
          ProposalState.Succeeded,
        );
      }
    },
  })),
});
