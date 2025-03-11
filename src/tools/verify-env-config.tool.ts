import { processEnv } from "@helpers/processEnv/processEnv.helper";
import { loggerHelper } from "@helpers/logger/logger.helper";

const logger = loggerHelper.get("VerifyEnv");
const { SEED_PHRASE, WALLET_PASSWORD, IS_MAINNET } = processEnv;

void (() => {
  if (!SEED_PHRASE) {
    logger.fatal("Seed phrase isn't specified by 'SEED_PHRASE' var");
    process.exit(1);
  }
  if (!WALLET_PASSWORD) {
    logger.fatal("Wallet password isn't specified by 'WALLET_PASSWORD' var");
    process.exit(1);
  }
  if (!IS_MAINNET) {
    logger.fatal("Chain isn't specified by 'IS_MAINNET' var");
    process.exit(1);
  }
  logger.info("Successfully verified env config!");
})();
