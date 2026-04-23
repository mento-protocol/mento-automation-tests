import { processEnv } from "@helpers/processEnv/processEnv.helper";

const { TEST_RUN_TIMEOUT, TEST_TIMEOUT } = processEnv;

export const timeouts = {
  get test(): number {
    return readTimeoutMs(TEST_TIMEOUT, timeouts.minute * 3);
  },
  get testRun(): number {
    return readTimeoutMs(TEST_RUN_TIMEOUT, timeouts.minute * 120);
  },
  get isOpenPage(): number {
    return this.l;
  },
  get action(): number {
    return this.xxxs;
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

function readTimeoutMs(raw: string | undefined, fallbackMs: number): number {
  if (raw == null || String(raw).trim() === "") {
    return fallbackMs;
  }
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallbackMs;
  }
  return parsed;
}
