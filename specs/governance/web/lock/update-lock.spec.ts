import { TestTag } from "@constants/test.constants";
import { suite } from "@helpers/suite/suite.helper";
import { WalletName } from "@shared/web/connect-wallet-modal/connect-wallet-modal.service";
import { expect } from "@fixtures/test.fixture";
import {
  testWalletAddresses,
  tokenAddresses,
} from "@constants/token.constants";
import { envHelper } from "@helpers/env/env.helper";
import { LockType } from "../../../../src/apps/governance/web/voting-power/voting-power.page";
import { LockAction } from "../../../../src/apps/governance/web/voting-power/voting-power.service";

suite({
  name: "Lock - Update",
  tags: [TestTag.Regression, TestTag.Sequential],
  beforeEach: async ({ web }) => {
    await web.app.governance.main.connectWalletByName(WalletName.Metamask);
  },
  tests: [
    {
      name: "Top-up for personal lock",
      testCaseId: "",
      test: async ({ web }) => {
        const app = web.app.governance;
        await app.main.openVotingPowerPage();
        await app.votingPower.waitForLocksSummary();

        const {
          totalVeMento: initialTotalVeMento,
          totalLockedMento: initialTotalLockedMento,
        } = await app.votingPower.getLocksSummary();

        await app.votingPower.waitForLocks();
        await app.votingPower.updateLock({
          lockAmount: "1",
          updateAction: LockAction.topUp,
          lockType: LockType.Personal,
        });
        await app.votingPower.waitForLocksSummaryToUpdate({
          totalVeMento: initialTotalVeMento,
          totalLockedMento: initialTotalLockedMento,
        });

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
      name: "Top-up and extend period for personal lock",
      testCaseId: "",
      tags: [TestTag.Smoke],
      test: async ({ web }) => {
        const app = web.app.governance;
        await app.main.openVotingPowerPage();
        await app.votingPower.waitForLocksSummary();

        const {
          totalVeMento: initialTotalVeMento,
          totalLockedMento: initialTotalLockedMento,
        } = await app.votingPower.getLocksSummary();

        await app.votingPower.waitForLocks();
        await app.votingPower.updateLock({
          lockAmount: "1",
          updateAction: LockAction.topUpAndExtend,
        });
        await app.votingPower.waitForLocksSummaryToUpdate({
          totalVeMento: initialTotalVeMento,
          totalLockedMento: initialTotalLockedMento,
        });

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
      name: "Top-up and delegate for personal lock",
      tags: [TestTag.Smoke],
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

        const initialLocksCount = await app.votingPower.getAllLocksCount();
        const {
          totalVeMento: initialTotalVeMento,
          totalLockedMento: initialTotalLockedMento,
          delegatedVeMento: initialDelegatedVeMento,
        } = await app.votingPower.getLocksSummary();

        await app.votingPower.updateLock({
          lockAmount: "1",
          lockType: LockType.Personal,
          delegateAddress,
          updateAction: LockAction.topUp,
        });
        await app.votingPower.waitForLocksSummaryToUpdate({
          totalVeMento: initialTotalVeMento,
          totalLockedMento: initialTotalLockedMento,
          delegatedVeMento: initialDelegatedVeMento,
        });
        await app.votingPower.waitForLocks();

        const currentLocksCount = await app.votingPower.getAllLocksCount();
        const {
          totalVeMento: currentTotalVeMento,
          delegatedVeMento: currentDelegatedVeMento,
        } = await app.votingPower.getLocksSummary();
        const delegateCurrentVeMento = await web.contract.getBalance({
          walletAddress: delegateAddress,
          tokenAddress: tokenToCheck,
        });

        expect.soft(currentLocksCount).toBe(initialLocksCount);
        expect.soft(currentTotalVeMento).toBeLessThan(initialTotalVeMento);
        expect
          .soft(currentDelegatedVeMento)
          .toBeGreaterThan(initialDelegatedVeMento);
        expect(delegateCurrentVeMento).toBeGreaterThan(delegateInitialVeMento);
      },
    },
    {
      name: "Top-up for delegated lock",
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

        await app.votingPower.updateLock({
          lockAmount: "1",
          lockType: LockType.Delegated,
          updateAction: LockAction.topUp,
        });
        await app.votingPower.waitForLocksSummaryToUpdate({
          totalLockedMento: initialTotalLockedMento,
          delegatedVeMento: initialDelegatedVeMento,
        });
        await app.votingPower.waitForLocks();

        const {
          totalVeMento: currentTotalVeMento,
          // totalLockedMento: currentTotalLockedMento,
          delegatedVeMento: currentDelegatedVeMento,
        } = await app.votingPower.getLocksSummary();
        await app.votingPower.waitForDelegateVeMentoToUpdate({
          initialDelegateVeMento: delegateInitialVeMento,
          delegateAddress,
          tokenToCheck,
        });
        const delegateCurrentVeMento = await web.contract.getBalance({
          walletAddress: delegateAddress,
          tokenAddress: tokenToCheck,
        });

        // TODO: Enable once clarification is provided
        // expect(currentTotalLockedMento).toBeGreaterThan(
        //   initialTotalLockedMento,
        // );
        expect.soft(currentTotalVeMento).toBe(initialTotalVeMento);
        expect
          .soft(currentDelegatedVeMento)
          .toBeGreaterThan(initialDelegatedVeMento);
        expect(delegateCurrentVeMento).toBeGreaterThan(delegateInitialVeMento);
      },
    },
    {
      name: "Top-up and extend period for delegated lock",
      testCaseId: "",
      tags: [TestTag.Smoke],
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

        await app.votingPower.updateLock({
          lockAmount: "1",
          lockType: LockType.Delegated,
          updateAction: LockAction.topUpAndExtend,
        });
        await app.votingPower.waitForLocksSummaryToUpdate({
          totalLockedMento: initialTotalLockedMento,
          delegatedVeMento: initialDelegatedVeMento,
        });
        await app.votingPower.waitForLocks();

        const {
          totalVeMento: currentTotalVeMento,
          // totalLockedMento: currentTotalLockedMento,
          delegatedVeMento: currentDelegatedVeMento,
        } = await app.votingPower.getLocksSummary();
        await app.votingPower.waitForDelegateVeMentoToUpdate({
          initialDelegateVeMento: delegateInitialVeMento,
          delegateAddress,
          tokenToCheck,
        });
        const delegateCurrentVeMento = await web.contract.getBalance({
          walletAddress: delegateAddress,
          tokenAddress: tokenToCheck,
        });

        // TODO: Enable once clarification is provided
        // expect(currentTotalLockedMento).toBeGreaterThan(
        //   initialTotalLockedMento,
        // );
        expect.soft(currentTotalVeMento).toBe(initialTotalVeMento);
        expect
          .soft(currentDelegatedVeMento)
          .toBeGreaterThan(initialDelegatedVeMento);
        expect
          .soft(delegateCurrentVeMento)
          .toBeGreaterThan(delegateInitialVeMento);
      },
    },
    {
      name: "Extend period for personal lock",
      testCaseId: "",
      test: async ({ web }) => {
        const app = web.app.governance;

        await app.main.openVotingPowerPage();
        await app.votingPower.waitForLocksSummary();

        const {
          totalVeMento: initialTotalVeMento,
          totalLockedMento: initialTotalLockedMento,
        } = await app.votingPower.getLocksSummary();

        await app.votingPower.waitForLocks();
        await app.votingPower.updateLock({
          lockAmount: "0",
          lockType: LockType.Personal,
          updateAction: LockAction.extend,
        });
        await app.votingPower.waitForLocksSummaryToUpdate({
          totalVeMento: initialTotalVeMento,
          totalLockedMento: initialTotalLockedMento,
        });

        const {
          totalVeMento: currentTotalVeMento,
          totalLockedMento: currentTotalLockedMento,
        } = await app.votingPower.getLocksSummary();

        expect.soft(currentTotalVeMento).toBeGreaterThan(initialTotalVeMento);
        expect(currentTotalLockedMento).toBe(initialTotalLockedMento);
      },
    },
    {
      name: "Extend period for delegated lock",
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

        const {
          totalVeMento: initialTotalVeMento,
          totalLockedMento: initialTotalLockedMento,
          delegatedVeMento: initialDelegatedVeMento,
        } = await app.votingPower.getLocksSummary();

        await app.votingPower.waitForLocks();
        await app.votingPower.updateLock({
          lockAmount: "0",
          lockType: LockType.Delegated,
          updateAction: LockAction.extend,
        });
        await app.votingPower.waitForLocksSummaryToUpdate({
          totalLockedMento: initialTotalLockedMento,
          delegatedVeMento: initialDelegatedVeMento,
        });

        const {
          totalVeMento: currentTotalVeMento,
          // totalLockedMento: currentTotalLockedMento,
          delegatedVeMento: currentDelegatedVeMento,
        } = await app.votingPower.getLocksSummary();
        await app.votingPower.waitForDelegateVeMentoToUpdate({
          initialDelegateVeMento: delegateInitialVeMento,
          delegateAddress,
          tokenToCheck,
        });
        const delegateCurrentVeMento = await web.contract.getBalance({
          walletAddress: delegateAddress,
          tokenAddress: tokenToCheck,
        });

        // TODO: Enable once clarification is provided
        // expect(currentTotalLockedMento).toBeGreaterThan(
        //   initialTotalLockedMento,
        // );
        expect.soft(currentTotalVeMento).toBe(initialTotalVeMento);
        expect
          .soft(currentDelegatedVeMento)
          .toBeGreaterThan(initialDelegatedVeMento);
        expect
          .soft(delegateCurrentVeMento)
          .toBeGreaterThan(delegateInitialVeMento);
      },
    },
  ],
});
