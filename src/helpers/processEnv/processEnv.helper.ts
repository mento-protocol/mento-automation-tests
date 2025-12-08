import { config } from "dotenv";

config();

interface IProcessEnvHelper {
  APP_NAME: string;
  ENV: string;
  USER_PASSWORD: string;
  SPECS_REGEX: string;
  EXCLUDE_SPECS_REGEX: string;
  SPECS_DIR: string;
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
  GOVERNANCE_QA_API_KEY: string;
  GOVERNANCE_QA_API_URL: string;
  GOVERNANCE_PROD_API_KEY: string;
  GOVERNANCE_PROD_API_URL: string;
  WALLET_ADDRESS: string;
  IS_PARALLEL_RUN: string;
  CUSTOM_URL: string;
  IS_MAINNET: string;
  WORKERS_COUNT: string;
  IS_FORK: string;
  VERCEL_AUTOMATION_BYPASS_SECRET: string;
}

export const processEnv = process.env as unknown as IProcessEnvHelper;
