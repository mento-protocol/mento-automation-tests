import { TestTag } from "@constants/test.constants";
import { suite } from "@helpers/suite/suite.helper";
import { WalletName } from "@shared/web/connect-wallet-modal/connect-wallet-modal.service";
import { expect } from "@fixtures/test.fixture";
import {
  testWalletAddresses,
  tokenAddresses,
} from "@constants/token.constants";
import { envHelper } from "@helpers/env/env.helper";

suite({
  name: "Lock - Create",
  tags: [TestTag.Regression, TestTag.Sequential, TestTag.Smoke],
  beforeEach: async ({ web }) => {
    await web.app.governance.main.connectWalletByName(WalletName.Metamask);
  },
  tests: [
    {
      name: "Create personal lock",
      testCaseId: "",
      test: async ({ web }) => {
        const app = web.app.governance;

        await app.main.openVotingPowerPage();
        await app.votingPower.waitForLocksSummary();
        await app.votingPower.waitForLocks();

        const {
          totalVeMento: initialTotalVeMento,
          totalLockedMento: initialTotalLockedMento,
        } = await app.votingPower.getLocksSummary();

        await app.votingPower.createLock({ lockAmount: "1" });
        await app.votingPower.waitForLocksSummaryToUpdate({
          totalVeMento: initialTotalVeMento,
          totalLockedMento: initialTotalLockedMento,
        });
        await app.votingPower.waitForLocks();

        const {
          totalLockedMento: currentTotalLockedMento,
          totalVeMento: currentTotalVeMento,
        } = await app.votingPower.getLocksSummary();

        expect.soft(currentTotalVeMento).toBeGreaterThan(initialTotalVeMento);
        expect(currentTotalLockedMento).toBeGreaterThan(
          initialTotalLockedMento,
        );
      },
    },
    {
      name: "Create personal lock with extending period",
      testCaseId: "",
      test: async ({ web }) => {
        const app = web.app.governance;

        await app.main.openVotingPowerPage();
        await app.votingPower.waitForLocksSummary();
        await app.votingPower.waitForLocks();

        const {
          totalVeMento: initialTotalVeMento,
          totalLockedMento: initialTotalLockedMento,
        } = await app.votingPower.getLocksSummary();

        await app.votingPower.createLock({
          lockAmount: "1",
          shouldExtendPeriod: true,
        });
        await app.votingPower.waitForLocksSummaryToUpdate({
          totalVeMento: initialTotalVeMento,
          totalLockedMento: initialTotalLockedMento,
        });
        await app.votingPower.waitForLocks();

        const {
          totalVeMento: currentTotalVeMento,
          totalLockedMento: currentTotalLockedMento,
        } = await app.votingPower.getLocksSummary();

        expect.soft(currentTotalVeMento).toBeGreaterThan(initialTotalVeMento);
        expect(currentTotalLockedMento).toBeGreaterThan(
          initialTotalLockedMento,
        );
      },
    },
    {
      name: "Create delegated lock",
      testCaseId: "",
      test: async ({ web }) => {
        const app = web.app.governance;
        const delegateAddress = testWalletAddresses.reserve;
        const tokenToCheck = tokenAddresses[envHelper.getChainType()].veMento;
        const delegateInitialVeMento = await web.contract.getBalance({
          walletAddress: delegateAddress,
          tokenAddress: tokenToCheck,
        });

        await app.main.openVotingPowerPage();
        await app.votingPower.waitForLocksSummary();
        await app.votingPower.waitForLocks();

        const {
          totalVeMento: initialTotalVeMento,
          totalLockedMento: initialTotalLockedMento,
          delegatedVeMento: initialDelegatedVeMento,
        } = await app.votingPower.getLocksSummary();

        await app.votingPower.createLock({
          lockAmount: "1",
          delegateAddress,
        });
        await app.votingPower.waitForLocksSummaryToUpdate({
          totalLockedMento: initialTotalLockedMento,
          delegatedVeMento: initialDelegatedVeMento,
        });
        await app.votingPower.waitForLocks();

        const {
          totalVeMento: currentTotalVeMento,
          totalLockedMento: currentTotalLockedMento,
          delegatedVeMento: currentDelegatedVeMento,
        } = await app.votingPower.getLocksSummary();
        const delegateCurrentVeMento = await web.contract.getBalance({
          walletAddress: delegateAddress,
          tokenAddress: tokenToCheck,
        });

        expect.soft(currentTotalVeMento).toBe(initialTotalVeMento);
        expect
          .soft(currentTotalLockedMento)
          .toBeGreaterThan(initialTotalLockedMento);
        expect
          .soft(currentDelegatedVeMento)
          .toBeGreaterThan(initialDelegatedVeMento);
        expect(delegateCurrentVeMento).toBeGreaterThan(delegateInitialVeMento);
      },
    },
    {
      name: "Create delegated lock with extending period",
      testCaseId: "",
      test: async ({ web }) => {
        const app = web.app.governance;
        const delegateAddress = testWalletAddresses.reserve;
        const tokenToCheck = tokenAddresses[envHelper.getChainType()].veMento;
        const delegateInitialVeMento = await web.contract.getBalance({
          walletAddress: delegateAddress,
          tokenAddress: tokenToCheck,
        });

        await app.main.openVotingPowerPage();
        await app.votingPower.waitForLocksSummary();
        await app.votingPower.waitForLocks();

        const {
          totalVeMento: initialTotalVeMento,
          totalLockedMento: initialTotalLockedMento,
          delegatedVeMento: initialDelegatedVeMento,
        } = await app.votingPower.getLocksSummary();

        await app.votingPower.createLock({
          lockAmount: "1",
          shouldExtendPeriod: true,
          delegateAddress,
        });
        await app.votingPower.waitForLocksSummaryToUpdate({
          totalLockedMento: initialTotalLockedMento,
          delegatedVeMento: initialDelegatedVeMento,
        });
        await app.votingPower.waitForLocks();

        const {
          totalVeMento: currentTotalVeMento,
          totalLockedMento: currentTotalLockedMento,
          delegatedVeMento: currentDelegatedVeMento,
        } = await app.votingPower.getLocksSummary();
        const delegateCurrentVeMento = await web.contract.getBalance({
          walletAddress: delegateAddress,
          tokenAddress: tokenToCheck,
        });

        expect.soft(currentTotalVeMento).toBe(initialTotalVeMento);
        expect
          .soft(currentTotalLockedMento)
          .toBeGreaterThan(initialTotalLockedMento);
        expect
          .soft(currentDelegatedVeMento)
          .toBeGreaterThan(initialDelegatedVeMento);
        expect(delegateCurrentVeMento).toBeGreaterThan(delegateInitialVeMento);
      },
    },
  ],
});
