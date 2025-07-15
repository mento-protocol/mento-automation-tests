import { TestTag } from "@constants/test.constants";
import { suite } from "@helpers/suite/suite.helper";
import { WalletName } from "@shared/web/connect-wallet-modal/connect-wallet-modal.service";
import { expect } from "@fixtures/test.fixture";
import { magicStrings } from "@constants/index";
import { ProposalState } from "../../../../src/apps/governance/web/proposal-view/proposal-view.service";

const { proposalData } = magicStrings.governance;

suite({
  name: "Proposal - Voting",
  tags: [TestTag.Regression, TestTag.Sequential, TestTag.Smoke],
  beforeEach: async ({ web }) => {
    const app = web.app.governance;
    await app.main.connectWalletByName(WalletName.Metamask);
    await web.contract.governance.createProposal(proposalData);
  },
  tests: [
    {
      name: "Approve a proposal successfully",
      testCaseId: "",
      test: async ({ web }) => {
        const app = web.app.governance;
        // TODO: Change to open by GQL request - directly to the proposal view page
        await app.main.openProposalByTitle(proposalData.title);
        await app.proposalView.expectProposal({
          title: proposalData.title,
          description: proposalData.description,
          state: ProposalState.Active,
        });
        await app.proposalView.approveProposal();
        expect
          .soft(await app.proposalView.isVoteCastSuccessfully())
          .toBeTruthy();
        // TODO: Turn on the assertion after it's fixed
        // expect(
        //   await app.proposalView.isParticipantAddressDisplayed(await web.metamask.getAddress()),
        // ).toBeTruthy();
      },
    },
  ],
});
