import { config } from "dotenv";

config();

interface IProcessEnvHelper {
  ENV: string;
  USER_PASSWORD: string;
  SPEC_NAMES: string;
  SPECS_TYPE: string;
  CI: string;
  SEED_PHRASE: string;
  TEST_RUNNER_TIMEOUT: string;
  LOG_LEVEL: string;
  TEST_RETRY: string;
}

export const processEnv = process.env as unknown as IProcessEnvHelper;
