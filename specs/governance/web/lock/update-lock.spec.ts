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
        await app.votingPower.waitForLockValues();

        const { veMento: initialVeMento, mento: initialMento } =
          await app.votingPower.getCurrentLockValues();

        await app.votingPower.waitForLocks();
        await app.votingPower.updateLock({
          lockAmount: "1",
          updateAction: LockAction.topUp,
          lockType: LockType.Personal,
        });
        await app.votingPower.waitForLockValuesToChange({
          initialVeMento,
          initialMento,
        });

        const { veMento: currentVeMento } =
          await app.votingPower.getCurrentLockValues();

        expect.soft(currentVeMento).toBeGreaterThan(initialVeMento);
        // TODO: Turn on once the bug is fixed https://vercel.live/link/governance.mento.org?page=%2Fvoting-power%3FvercelThreadId%3D3stKN&via=in-app-copy-link&p=1
        // expect(currentMento).toBeGreaterThan(initialMento);
      },
    },
    {
      name: "Top-up and extend period for personal lock",
      testCaseId: "",
      tags: [TestTag.Smoke],
      test: async ({ web }) => {
        const app = web.app.governance;
        await app.main.openVotingPowerPage();
        await app.votingPower.waitForLockValues();

        const { veMento: initialVeMento, mento: initialMento } =
          await app.votingPower.getCurrentLockValues();

        await app.votingPower.waitForLocks();
        await app.votingPower.updateLock({
          lockAmount: "1",
          updateAction: LockAction.topUpAndExtend,
        });
        await app.votingPower.waitForLockValuesToChange({
          initialVeMento,
          initialMento,
        });

        const { veMento: currentVeMento } =
          await app.votingPower.getCurrentLockValues();
        expect.soft(currentVeMento).toBeGreaterThan(initialVeMento);
        // TODO: Turn on once the bug is fixed https://vercel.live/link/governance.mento.org?page=%2Fvoting-power%3FvercelThreadId%3D3stKN&via=in-app-copy-link&p=1
        // expect(currentMento).toBeGreaterThan(initialMento);
      },
    },
    {
      name: "Top-up and delegate for personal lock",
      tags: [TestTag.Smoke],
      testCaseId: "",
      test: async ({ web }) => {
        const app = web.app.governance;
        const delegateAddress = testWalletAddresses.reserve;
        const tokenToCheck = tokenAddresses[envHelper.getChain()].veMento;
        const delegateInitialVeMento = await web.contract.getBalance({
          walletAddress: delegateAddress,
          tokenAddress: tokenToCheck,
        });

        await app.main.openVotingPowerPage();
        await app.votingPower.waitForLockValues();
        await app.votingPower.waitForLocks();

        const initialLocksCount = await app.votingPower.getAllLocksCount();
        const { veMento: myInitialVeMento, mento: initialMento } =
          await app.votingPower.getCurrentLockValues();

        await app.votingPower.updateLock({
          lockAmount: "1",
          lockType: LockType.Personal,
          delegateAddress,
          updateAction: LockAction.topUp,
        });
        await app.votingPower.waitForLockValuesToChange({
          initialVeMento: myInitialVeMento,
          initialMento,
        });
        await app.votingPower.waitForLocks();

        const currentLocksCount = await app.votingPower.getAllLocksCount();
        const { veMento: myCurrentVeMento } =
          await app.votingPower.getCurrentLockValues();
        const delegateCurrentVeMento = await web.contract.getBalance({
          walletAddress: delegateAddress,
          tokenAddress: tokenToCheck,
        });

        expect.soft(currentLocksCount).toBe(initialLocksCount);
        expect.soft(myCurrentVeMento).toBeLessThan(myInitialVeMento);
        expect(delegateCurrentVeMento).toBeGreaterThan(delegateInitialVeMento);
      },
    },
    {
      name: "Top-up for delegated lock",
      testCaseId: "",
      test: async ({ web }) => {
        const app = web.app.governance;
        const delegateAddress = testWalletAddresses.reserve;
        const tokenToCheck = tokenAddresses[envHelper.getChain()].veMento;
        const delegateInitialVeMento = await web.contract.getBalance({
          walletAddress: delegateAddress,
          tokenAddress: tokenToCheck,
        });
        await app.main.openVotingPowerPage();
        await app.votingPower.waitForLockValues();
        await app.votingPower.waitForLocks();
        const initialLocksCount = await app.votingPower.getAllLocksCount();
        const { veMento: myInitialVeMento, mento: initialMento } =
          await app.votingPower.getCurrentLockValues();
        await app.votingPower.updateLock({
          lockAmount: "1",
          lockType: LockType.Delegated,
          updateAction: LockAction.topUp,
        });
        await app.votingPower.waitForLockValuesToChange({
          initialVeMento: myInitialVeMento,
          initialMento,
        });
        await app.votingPower.waitForLocks();
        const currentLocksCount = await app.votingPower.getAllLocksCount();
        const { veMento: myCurrentVeMento } =
          await app.votingPower.getCurrentLockValues();
        const delegateCurrentVeMento = await web.contract.getBalance({
          walletAddress: delegateAddress,
          tokenAddress: tokenToCheck,
        });
        expect.soft(currentLocksCount).toBe(initialLocksCount);
        expect.soft(myCurrentVeMento).toBe(myInitialVeMento);
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
        const tokenToCheck = tokenAddresses[envHelper.getChain()].veMento;
        const delegateInitialVeMento = await web.contract.getBalance({
          walletAddress: delegateAddress,
          tokenAddress: tokenToCheck,
        });
        await app.main.openVotingPowerPage();
        await app.votingPower.waitForLockValues();
        await app.votingPower.waitForLocks();
        const initialLocksCount = await app.votingPower.getAllLocksCount();
        const { veMento: myInitialVeMento, mento: initialMento } =
          await app.votingPower.getCurrentLockValues();
        await app.votingPower.updateLock({
          lockAmount: "1",
          lockType: LockType.Delegated,
          updateAction: LockAction.topUpAndExtend,
        });
        await app.votingPower.waitForLockValuesToChange({
          initialVeMento: myInitialVeMento,
          initialMento,
        });
        await app.votingPower.waitForLocks();
        const currentLocksCount = await app.votingPower.getAllLocksCount();
        const { veMento: myCurrentVeMento } =
          await app.votingPower.getCurrentLockValues();
        const delegateCurrentVeMento = await web.contract.getBalance({
          walletAddress: delegateAddress,
          tokenAddress: tokenToCheck,
        });
        expect.soft(currentLocksCount).toBe(initialLocksCount);
        expect.soft(myCurrentVeMento).toBe(myInitialVeMento);
        expect(delegateCurrentVeMento).toBeGreaterThan(delegateInitialVeMento);
      },
    },
    {
      name: "Extend period for personal lock",
      testCaseId: "",
      test: async ({ web }) => {
        const app = web.app.governance;
        await app.main.openVotingPowerPage();
        await app.votingPower.waitForLockValues();
        const { veMento: initialVeMento, mento: initialMento } =
          await app.votingPower.getCurrentLockValues();
        await app.votingPower.waitForLocks();
        await app.votingPower.updateLock({
          lockAmount: "0",
          lockType: LockType.Personal,
          updateAction: LockAction.extend,
        });
        await app.votingPower.waitForLockValuesToChange({
          initialVeMento,
          initialMento,
        });
        const { veMento: currentVeMento } =
          await app.votingPower.getCurrentLockValues();
        expect(currentVeMento).toBeGreaterThan(initialVeMento);
      },
    },
    {
      name: "Extend period for delegated lock",
      testCaseId: "",
      test: async ({ web }) => {
        const app = web.app.governance;
        const delegateAddress = testWalletAddresses.reserve;
        const tokenToCheck = tokenAddresses[envHelper.getChain()].veMento;
        const delegateInitialVeMento = await web.contract.getBalance({
          walletAddress: delegateAddress,
          tokenAddress: tokenToCheck,
        });

        await app.main.openVotingPowerPage();
        await app.votingPower.waitForLockValues();
        const { veMento: initialVeMento, mento: initialMento } =
          await app.votingPower.getCurrentLockValues();
        await app.votingPower.waitForLocks();
        await app.votingPower.updateLock({
          lockAmount: "0",
          lockType: LockType.Delegated,
          updateAction: LockAction.extend,
        });
        await app.votingPower.waitForLockValuesToChange({
          initialVeMento,
          initialMento,
        });
        const { veMento: currentVeMento } =
          await app.votingPower.getCurrentLockValues();
        const delegateCurrentVeMento = await web.contract.getBalance({
          walletAddress: delegateAddress,
          tokenAddress: tokenToCheck,
        });

        expect.soft(currentVeMento).toBe(initialVeMento);
        expect(delegateCurrentVeMento).toBeGreaterThan(delegateInitialVeMento);
      },
    },
  ],
});
