import { processEnv } from "@helpers/processEnv/processEnv.helper";
import { envHelper } from "@helpers/env/env.helper";

const { TEST_RUN_TIMEOUT, TEST_TIMEOUT } = processEnv;

export const timeouts = {
  get test(): number {
    return Number(TEST_TIMEOUT) ?? timeouts.minute * 4;
  },
  get testRun(): number {
    return Number(TEST_RUN_TIMEOUT) ?? timeouts.minute * 55;
  },
  get isOpenPage(): number {
    return this.m;
  },
  animation: 250,
  xxxxs: 500,
  xxxs: 1_000,
  xxs: 2_000,
  xs: 4_000,
  s: 8_000,
  m: 14_000,
  l: 20_000,
  xl: 30_000,
  xxl: 60_000,
  xxxl: 1.5 * 60_000,
  xxxxl: 2.5 * 60_000,
  xxxxxl: 4 * 60_000,
  second: 1000,
  minute: 60_000,
  hour: 60 * 60_000,
};
