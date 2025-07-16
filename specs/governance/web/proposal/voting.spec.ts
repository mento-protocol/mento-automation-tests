import { magicStrings, TestTag } from "@constants/index";
import { suite } from "@helpers/suite/suite.helper";
import { WalletName } from "@shared/web/connect-wallet-modal/connect-wallet-modal.service";
import { Vote } from "../../../../src/apps/governance/web/proposal-view/proposal-view.service";

const { proposalData: proposal } = magicStrings.governance;
const testCases = [
  { name: "Approve successfully", vote: Vote.Approve },
  { name: "Reject successfully", vote: Vote.Reject },
  { name: "Abstain successfully", vote: Vote.Abstain },
];

suite({
  name: "Proposal - Voting",
  tags: [TestTag.Regression, TestTag.Sequential, TestTag.Smoke],
  beforeEach: async ({ web }) => {
    const app = web.app.governance;
    await app.main.connectWalletByName(WalletName.Metamask);
    await web.contract.governance.createProposal(proposal);
    // TODO: Change to open by GQL request - directly to the proposal view page to exclude UI interaction
    await app.main.openProposalByTitle(proposal.title);
  },
  tests: testCases.map(({ name, vote }) => ({
    name,
    testCaseId: "",
    test: async ({ web }) => {
      const app = web.app.governance;
      const initialReachedQuorum = await app.proposalView.getReachedQuorum();

      await app.proposalView.vote(vote);
      await app.proposalView.expectVote({ initialReachedQuorum, vote });
    },
  })),
});
