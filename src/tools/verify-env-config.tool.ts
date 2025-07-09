import { processEnv } from "@helpers/processEnv/processEnv.helper";
import { loggerHelper } from "@helpers/logger/logger.helper";

const log = loggerHelper.get("VerifyEnvConfig");
const { SEED_PHRASE, WALLET_PASSWORD, IS_MAINNET, APP_NAME } = processEnv;
const envVars = [
  { name: "SEED_PHRASE", value: SEED_PHRASE },
  { name: "WALLET_PASSWORD", value: WALLET_PASSWORD },
  { name: "IS_MAINNET", value: IS_MAINNET },
  { name: "APP_NAME", value: APP_NAME },
];

void (() => {
  log.trace("🔄 Verifying .env config...");
  const errors = envVars
    .map(({ name, value }) => verifyEnvVar({ name, value }))
    .filter(Boolean);

  if (errors?.length) {
    errors.forEach(error => log.error(error));
    log.fatal("❌ Failed to verify .env config!");
    process.exit(1);
  }
  log.info("✅ Successfully verified .env config!");
})();

function verifyEnvVar({ name, value }: { name: string; value: string }) {
  if (!value) return `⭕️ '${name}' var isn't specified`;
  return;
}
