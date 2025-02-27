import { config } from "dotenv";

config();

interface IProcessEnvHelper {
  ENV: string;
  USER_PASSWORD: string;
  SPEC_NAMES: string;
  SPECS_FOLDER_NAME: string;
  SPECS_TYPE: string;
  CI: string;
  SEED_PHRASE: string;
  WALLET_PASSWORD: string;
  TEST_RUN_TIMEOUT: string;
  TEST_TIMEOUT: string;
  LOG_LEVEL: string;
  TEST_RETRY: string;
  HTML_REPORT_NAME: string;
  TESTOMAT_REPORT_GENERATION: string;
  TESTOMAT_API_KEY: string;
  TESTOMATIO_TITLE: string;
  WALLET_ADDRESS: string;
  IS_PARALLEL_RUN: string;
  CUSTOM_URL: string;
  IS_MAINNET: string;
}

export const processEnv = process.env as unknown as IProcessEnvHelper;
