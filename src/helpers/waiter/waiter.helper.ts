import { ISleepOptions, IWaitOptions } from "@helpers/waiter/waiters.types";
import { timeouts } from "@constants/timeouts.constants";
import { loggerHelper } from "@helpers/logger/logger.helper";

const logger = loggerHelper.get("WaiterHelper");

export const waiterHelper = {
  sleep(timeout: number, options: ISleepOptions = {}): Promise<void> {
    const { sleepReason, ignoreReason = false } = options;
    ignoreReason ||
      logger.warn(
        `Sleeping ${timeout / 1000} seconds${
          sleepReason ? ` due to: ${sleepReason}` : ""
        }`,
      );
    return new Promise(resolve => setTimeout(resolve, timeout));
  },

  waitForAnimation(): Promise<void> {
    return this.sleep(timeouts.animation, { ignoreReason: true });
  },

  async retry<T>(
    callback: () => Promise<T>,
    retryCount: number,
    options: IRetryOptions = {},
  ): Promise<T> {
    const {
      interval = timeouts.xxxs,
      throwError = true,
      resolveWhenNoException = false,
      continueWithException = resolveWhenNoException,
      errorMessage,
    } = options;
    let caughtError: Error = null;
    do {
      try {
        const result = await callback();
        if (resolveWhenNoException || result) {
          return result;
        }
      } catch (err) {
        caughtError = err;
        if (!continueWithException) {
          break;
        }
      }
      await this.logErrorAndSleep(errorMessage, caughtError, interval);
    } while (retryCount--);
    throwError && logRetryFailedAndThrow(errorMessage, caughtError);
    logger.warn(`${errorMessage}: ${caughtError?.message}`);
  },

  async logErrorAndSleep(
    errorMessage: string,
    err: Error,
    interval: number,
  ): Promise<void> {
    if (err || errorMessage) {
      logger.warn(`${errorMessage}: ${err?.message}`);
    }
    logger.warn(`Retrying...`);
    await this.sleep(interval, { ignoreReason: true });
  },
};

function hasTime(startTime: number, timeout: number): boolean {
  return Date.now() < startTime + timeout;
}

function logRetryFailedAndThrow(
  errorMessage: string,
  caughtError: Error,
): never {
  const message = `Retry failed: ${errorMessage}
      ${caughtError.message || ""}`;
  logger.error(message);
  throw new Error(message);
}

interface IRetryOptions extends IWaitOptions {
  continueWithException?: boolean;
  resolveWhenNoException?: boolean;
}
