import { Address } from "viem";

import { forkHelper } from "@helpers/fork/fork.helper";
import { contractHelper } from "@helpers/contract/contract.helper";
import { TokenSymbol } from "@constants/index";
import { envHelper } from "@helpers/env/env.helper";
import { web3Helper } from "@helpers/web3/web3.helper";

void (async function setupFork() {
  console.info("🚀 Starting fork setup...\n");

  // A random cUSD holder address - can be replaced with any other address
  const cUsdHolder = "0xB5BBea2325a8f5a0130a1Aaa372bA768F1C62c43" as Address;
  const amount = 1000;
  const testWalletAddress = web3Helper.extractAddress(
    envHelper.getSeedPhrase(),
  );
  const cUSDAddress = await contractHelper.governance.getTokenAddress(
    TokenSymbol.cUSD,
  );

  console.info(`ℹ️  Test wallet address: ${testWalletAddress}\n`);
  await forkHelper.transfer(cUSDAddress, cUsdHolder, testWalletAddress, amount);
  console.info(`💰 Transferred ${amount} cUSD\n`);
  await forkHelper.reportPrices();
  console.info("✅ Fork setup completed successfully!\n");
})();
