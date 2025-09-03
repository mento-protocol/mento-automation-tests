import {
  IRetryOptions,
  ISleepOptions,
  IWaitOpts,
} from "@helpers/waiter/waiters.types";
import { timeouts } from "@constants/timeouts.constants";
import { loggerHelper } from "@helpers/logger/logger.helper";

const log = loggerHelper.get("WaiterHelper");

export const waiterHelper = {
  sleep(timeout: number, options: ISleepOptions = {}): Promise<void> {
    const { sleepReason, ignoreReason = false } = options;
    ignoreReason ||
      log.warn(
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
    log.warn(`${errorMessage}${caughtError ? `:${caughtError.message}` : ""}`);
  },

  async logErrorAndSleep(
    errorMessage: string,
    err: Error,
    interval: number,
  ): Promise<void> {
    if (err || errorMessage) {
      log.warn(`${errorMessage}${err ? `:${err.message}` : ""}`);
    }
    log.warn(`Retrying...`);
    await this.sleep(interval, { ignoreReason: true });
  },

  async wait(
    callback: () => Promise<boolean>,
    timeout: number,
    { interval = 100, errorMessage, throwError = true }: IWaitOpts = {},
  ): Promise<boolean> {
    const startTime = Date.now();
    while (hasTime(startTime, timeout)) {
      try {
        const result = await callback();
        if (result) {
          return result;
        }
        errorMessage && log.warn(errorMessage);
        await this.sleep(interval, { ignoreReason: true });
      } catch (error) {
        if (throwError) {
          errorMessage && log.error(errorMessage);
          throw new Error(error);
        }
        errorMessage && log.warn(errorMessage);
        return false;
      }
    }
    errorMessage && log.error(errorMessage);
    if (throwError) {
      throw new Error(
        `${errorMessage}\nWait timeout has reached with ${timeout} timeout.`,
      );
    }
  },

  async checkDuring({
    checkCallback,
    duringCallback,
    duringTimeout = timeouts.xxs,
    errorMessage = `Some check failed during some action`,
    throwError = true,
  }: ICheckDuringParams): Promise<boolean> {
    const logType = throwError ? "error" : "warn";
    const startTime = Date.now();
    let result = false;

    while ((await duringCallback()) && hasTime(startTime, duringTimeout)) {
      try {
        result = await checkCallback();
      } catch (error) {
        const message = `${errorMessage}${error ? `:${error.message}` : ""}`;
        log[logType](`${message}`);
        if (throwError) throw message;
      }
    }
    return result;
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
      ${caughtError?.message || ""}`;
  log.error(message);
  throw new Error(message);
}

interface ICheckDuringParams {
  checkCallback: () => Promise<boolean>;
  duringCallback: () => Promise<boolean>;
  duringTimeout?: number;
  errorMessage?: string;
  throwError?: boolean;
}
