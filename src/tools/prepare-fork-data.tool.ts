import { forkHelper } from "@helpers/fork/fork.helper";

void (async function setupFork() {
  console.info("🚀 Starting fork setup...\n");
  await forkHelper.reportPrices();
  await forkHelper.setInitialBalances();
  console.info("✅ Fork setup completed successfully!\n");
})();
