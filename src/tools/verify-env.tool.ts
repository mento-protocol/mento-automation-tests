import { processEnv } from "@helpers/processEnv/processEnv.helper";
import { loggerHelper } from "@helpers/logger/logger.helper";

const logger = loggerHelper.get("VerifyEnv");
const { SEED_PHRASE, WALLET_PASSWORD, IS_MAINNET } = processEnv;

void (() => {
  if (!SEED_PHRASE) {
    logger.fatal("Seed phrase isn't provided");
    process.exit(1);
  }
  if (!WALLET_PASSWORD) {
    logger.fatal("Wallet password isn't provided");
    process.exit(1);
  }
  if (!IS_MAINNET) {
    logger.fatal("Chain is not specified by 'IS_MAINNET' flag");
    process.exit(1);
  }
  logger.info("Successfully verified env variables!");
})();
