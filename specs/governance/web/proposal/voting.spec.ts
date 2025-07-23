import { magicStrings, TestTag } from "@constants/index";
import { suite } from "@helpers/suite/suite.helper";
import { WalletName } from "@shared/web/connect-wallet-modal/connect-wallet-modal.service";
import { Vote } from "../../../../src/apps/governance/web/proposal-view/proposal-view.service";

const testCases = [
  { name: "'Yes' successfully", vote: Vote.Yes },
  { name: "'No' successfully", vote: Vote.No },
  { name: "'Abstain' successfully", vote: Vote.Abstain },
];

suite({
  name: "Proposal - Voting",
  tags: [TestTag.Regression, TestTag.Sequential, TestTag.Smoke],
  beforeEach: async ({ web }) => {
    const app = web.app.governance;
    const proposalData = magicStrings.governance.generateProposalData();

    await app.main.connectWalletByName(WalletName.Metamask);
    await web.contract.governance.createProposal(proposalData);
    // TODO: Use the navigateToAppPage method once there's a correct proposalId gotten
    await app.main.openProposalByTitle(proposalData.title);
  },
  tests: testCases.map(({ name, vote }) => ({
    name,
    testCaseId: "",
    test: async ({ web }) => {
      const app = web.app.governance;

      await app.proposalView.vote(vote);
      await app.proposalView.expectVote(vote);
    },
  })),
});
