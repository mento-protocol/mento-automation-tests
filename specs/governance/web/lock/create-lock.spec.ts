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
        await app.votingPower.waitForLockValues();
        await app.votingPower.waitForLocks();

        // TODO: Enable once the bug is fixed: https://vercel.live/link/governancementoorg-git-feature-multiple-locks-support-mentolabs.vercel.app?page=%2Fvoting-power%3FvercelThreadId%3DS-etp&via=in-app-copy-link&p=1
        // const initialLocksCount = await app.votingPower.getAllLocksCount();
        const { veMento: initialVeMento, mento: initialMento } =
          await app.votingPower.getCurrentLockValues();

        await app.votingPower.createLock({ lockAmount: "1" });
        await app.votingPower.waitForLockValuesToChange({
          initialVeMento,
          initialMento,
        });
        await app.votingPower.waitForLocks();

        // TODO: Enable once the bug is fixed: https://vercel.live/link/governancementoorg-git-feature-multiple-locks-support-mentolabs.vercel.app?page=%2Fvoting-power%3FvercelThreadId%3DS-etp&via=in-app-copy-link&p=1
        // const currentLocksCount = await app.votingPower.getAllLocksCount();
        const { veMento: currentVeMento } =
          await app.votingPower.getCurrentLockValues();

        // TODO: Enable once the bug is fixed: https://vercel.live/link/governancementoorg-git-feature-multiple-locks-support-mentolabs.vercel.app?page=%2Fvoting-power%3FvercelThreadId%3DS-etp&via=in-app-copy-link&p=1
        // expect.soft(currentLocksCount).toBeGreaterThan(initialLocksCount);
        expect.soft(currentVeMento).toBeGreaterThan(initialVeMento);
        // TODO: Enable once the bug is fixed https://vercel.live/link/governance.mento.org?page=%2Fvoting-power%3FvercelThreadId%3D3stKN&via=in-app-copy-link&p=1
        // expect(currentMento).toBeGreaterThan(initialMento);
      },
    },
    {
      name: "Create personal lock with extending period",
      testCaseId: "",
      test: async ({ web }) => {
        const app = web.app.governance;

        await app.main.openVotingPowerPage();
        await app.votingPower.waitForLockValues();
        await app.votingPower.waitForLocks();

        // TODO: Enable once the bug is fixed: https://vercel.live/link/governancementoorg-git-feature-multiple-locks-support-mentolabs.vercel.app?page=%2Fvoting-power%3FvercelThreadId%3DS-etp&via=in-app-copy-link&p=1
        // const initialLocksCount = await app.votingPower.getAllLocksCount();
        const { veMento: initialVeMento, mento: initialMento } =
          await app.votingPower.getCurrentLockValues();

        await app.votingPower.createLock({
          lockAmount: "1",
          shouldExtendPeriod: true,
        });
        await app.votingPower.waitForLockValuesToChange({
          initialVeMento,
          initialMento,
        });
        await app.votingPower.waitForLocks();

        // TODO: Enable once the bug is fixed: https://vercel.live/link/governancementoorg-git-feature-multiple-locks-support-mentolabs.vercel.app?page=%2Fvoting-power%3FvercelThreadId%3DS-etp&via=in-app-copy-link&p=1
        // const currentLocksCount = await app.votingPower.getAllLocksCount();
        const { veMento: currentVeMento } =
          await app.votingPower.getCurrentLockValues();

        // TODO: Enable once the bug is fixed: https://vercel.live/link/governancementoorg-git-feature-multiple-locks-support-mentolabs.vercel.app?page=%2Fvoting-power%3FvercelThreadId%3DS-etp&via=in-app-copy-link&p=1
        // expect.soft(currentLocksCount).toBeGreaterThan(initialLocksCount);
        expect.soft(currentVeMento).toBeGreaterThan(initialVeMento);
        // TODO: Turn on once the bug is fixed https://vercel.live/link/governance.mento.org?page=%2Fvoting-power%3FvercelThreadId%3D3stKN&via=in-app-copy-link&p=1
        // expect(currentMento).toBeGreaterThan(initialMento);
      },
    },
    {
      name: "Create delegated lock",
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

        // TODO: Enable once the bug is fixed: https://vercel.live/link/governancementoorg-git-feature-multiple-locks-support-mentolabs.vercel.app?page=%2Fvoting-power%3FvercelThreadId%3DS-etp&via=in-app-copy-link&p=1
        // const initialLocksCount = await app.votingPower.getAllLocksCount();
        const { veMento: myInitialVeMento, mento: initialMento } =
          await app.votingPower.getCurrentLockValues();

        await app.votingPower.createLock({
          lockAmount: "1",
          delegateAddress,
        });
        await app.votingPower.waitForLockValuesToChange({
          initialVeMento: myInitialVeMento,
          initialMento,
        });
        await app.votingPower.waitForLocks();

        // TODO: Enable once the bug is fixed: https://vercel.live/link/governancementoorg-git-feature-multiple-locks-support-mentolabs.vercel.app?page=%2Fvoting-power%3FvercelThreadId%3DS-etp&via=in-app-copy-link&p=1
        // const currentLocksCount = await app.votingPower.getAllLocksCount();
        const { veMento: myCurrentVeMento } =
          await app.votingPower.getCurrentLockValues();
        const delegateCurrentVeMento = await web.contract.getBalance({
          walletAddress: delegateAddress,
          tokenAddress: tokenToCheck,
        });

        // TODO: Enable once the bug is fixed: https://vercel.live/link/governancementoorg-git-feature-multiple-locks-support-mentolabs.vercel.app?page=%2Fvoting-power%3FvercelThreadId%3DS-etp&via=in-app-copy-link&p=1
        // expect.soft(currentLocksCount).toBeGreaterThan(initialLocksCount);
        expect.soft(myCurrentVeMento).toBe(myInitialVeMento);
        expect(delegateCurrentVeMento).toBeGreaterThan(delegateInitialVeMento);
      },
    },
    {
      name: "Create delegated lock with extending period",
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

        // TODO: Enable once the bug is fixed: https://vercel.live/link/governancementoorg-git-feature-multiple-locks-support-mentolabs.vercel.app?page=%2Fvoting-power%3FvercelThreadId%3DS-etp&via=in-app-copy-link&p=1
        // const initialLocksCount = await app.votingPower.getAllLocksCount();
        const { veMento: myInitialVeMento, mento: initialMento } =
          await app.votingPower.getCurrentLockValues();

        await app.votingPower.createLock({
          lockAmount: "1",
          shouldExtendPeriod: true,
          delegateAddress,
        });
        await app.votingPower.waitForLockValuesToChange({
          initialVeMento: myInitialVeMento,
          initialMento,
        });
        await app.votingPower.waitForLocks();

        // TODO: Enable once the bug is fixed: https://vercel.live/link/governancementoorg-git-feature-multiple-locks-support-mentolabs.vercel.app?page=%2Fvoting-power%3FvercelThreadId%3DS-etp&via=in-app-copy-link&p=1
        // const currentLocksCount = await app.votingPower.getAllLocksCount();
        const { veMento: myCurrentVeMento } =
          await app.votingPower.getCurrentLockValues();
        const delegateCurrentVeMento = await web.contract.getBalance({
          walletAddress: delegateAddress,
          tokenAddress: tokenToCheck,
        });

        // TODO: Enable once the bug is fixed: https://vercel.live/link/governancementoorg-git-feature-multiple-locks-support-mentolabs.vercel.app?page=%2Fvoting-power%3FvercelThreadId%3DS-etp&via=in-app-copy-link&p=1
        // expect.soft(currentLocksCount).toBeGreaterThan(initialLocksCount);
        expect.soft(myCurrentVeMento).toBe(myInitialVeMento);
        expect(delegateCurrentVeMento).toBeGreaterThan(delegateInitialVeMento);
      },
    },
  ],
});
