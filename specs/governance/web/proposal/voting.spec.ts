import { magicStrings, TestTag, timeouts } from "@constants/index";
import { suite } from "@helpers/suite/suite.helper";
import { WalletName } from "@shared/web/connect-wallet-modal/connect-wallet-modal.service";
import {
  ProposalState,
  Vote,
} from "../../../../src/apps/governance/web/proposal-view/proposal-view.service";
import { expect } from "@fixtures/test.fixture";
import { IGovernanceApp } from "@helpers/assembler/assembler.helper";

const testCases = [
  {
    name: "'Yes' successfully",
    vote: Vote.Yes,
    timeout: timeouts.minute * 12,
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
    await app.main.connectWalletByName(WalletName.Metamask);
  },
  tests: testCases.map(({ name, vote, timeout, tags }) => ({
    name,
    testCaseId: "",
    timeout,
    tags,
    test: async ({ web }) => {
      const app = web.app.governance;
      const isYesVote = vote === Vote.Yes;
      const proposalData = magicStrings.governance.generateProposalData({
        shouldMarkToExecute: isYesVote,
      });

      await web.contract.governance.createProposal(proposalData);
      await app.main.openProposalByTitle(proposalData.title);

      await app.proposalView.vote(vote);
      await app.proposalView.expectVote(vote);

      if (isYesVote) await expectYesVote(app, timeout);
    },
  })),
});

async function expectYesVote(
  app: IGovernanceApp,
  timeout: number = timeouts.minute * 10,
): Promise<void> {
  await app.proposalView.waitForProposalState(ProposalState.Succeeded, {
    timeout,
    interval: timeouts.xl,
  });
  expect(await app.proposalView.getProposalState()).toBe(
    ProposalState.Succeeded,
  );
}
