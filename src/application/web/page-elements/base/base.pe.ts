import { Locator } from "@playwright/test";
import * as console from "console";

import { ElementSearcher } from "@helpers/element-finder/types/index.types";
import { loggerHelper } from "@helpers/logger/logger.helper";
import {
  IBasePe,
  IClickParams,
  IGetTextParams,
  IWaitUntilDisplayed,
} from "@page-elements/index";
import { waiterHelper } from "@helpers/waiter/waiter.helper";
import { timeouts } from "@constants/timeouts.constants";

const logger = loggerHelper.get("BaseElementPe");

export abstract class BasePe implements IBasePe {
  protected constructor(protected elementSearcher: ElementSearcher) {}

  protected get element(): Promise<Locator> {
    return this.elementSearcher.findElement();
  }

  protected get locator(): string {
    return this.elementSearcher.locator;
  }

  async isDisplayed(): Promise<boolean> {
    return (await this.element).isVisible();
  }

  async isEnabled(): Promise<boolean> {
    return (await this.element).isEnabled();
  }

  async click({
    throwError = true,
    timeout,
  }: IClickParams = {}): Promise<void> {
    const element = await this.element;
    await this.waitUntilDisplayed(timeouts.action);
    try {
      if (await this.isEnabled()) {
        await element.click({ timeout });
      } else {
        logger.warn(
          `Element with '${this.locator}' is disabled - force clicking...`,
        );
        await element.click({ force: true, timeout });
      }
    } catch (error) {
      const errorMessage = `Can't click on element with '${this.locator}' locator.\nError details: ${error.message}`;
      if (throwError) throw new Error(errorMessage);
      logger.error(errorMessage);
    }
  }

  async jsClick(): Promise<void> {
    return (await this.element).dispatchEvent("click");
  }

  async getText({
    timeout,
    throwError = true,
  }: IGetTextParams = {}): Promise<string> {
    try {
      await this.waitUntilDisplayed(timeouts.action);
      return (await this.element).textContent({ timeout });
    } catch (error) {
      const errorMessage = `Can't get text on element with '${this.locator}' locator.\nError details: ${error.message}`;
      logger.error(errorMessage);
      if (throwError) throw new Error(errorMessage);
    }
  }

  async getValue({ throwError = true }: IGetValueParams = {}): Promise<string> {
    try {
      await this.waitUntilDisplayed(timeouts.action);
      return (await this.element).inputValue();
    } catch (error) {
      const errorMessage = `Can't get value on element with '${this.locator}' locator.\nError details: ${error.message}`;
      logger.error(errorMessage);
      if (throwError) throw new Error(errorMessage);
    }
  }

  async waitUntilDisplayed(
    timeout: number,
    {
      throwError = true,
      errorMessage = "Failed to wait for element to display",
    }: IWaitUntilDisplayed = {},
  ): Promise<boolean> {
    try {
      await (await this.element).waitFor({ timeout, state: "visible" });
      return true;
    } catch (error) {
      logger.warn(`${errorMessage}: ${this.locator}`);
      if (throwError) {
        throw { ...error, message: `${errorMessage}: ${error.message}}` };
      }
      return false;
    }
  }

  async waitUntilDisappeared(
    timeout: number,
    {
      throwError = true,
      errorMessage = "Failed to wait for element to disappear",
    }: IWaitUntilDisplayed = {},
  ): Promise<boolean> {
    try {
      await (await this.element).waitFor({ timeout, state: "hidden" });
      return true;
    } catch (error) {
      console.error(`${errorMessage}: ${this.elementSearcher.locator}`);
      if (throwError) {
        throw { ...error, message: `${errorMessage}: ${error.message}}` };
      }
      return false;
    }
  }

  async waitUntilExist(
    timeout: number,
    {
      throwError = true,
      errorMessage = "Failed to wait for element to exist",
    }: IWaitUntilDisplayed = {},
  ): Promise<boolean> {
    try {
      await (await this.element).waitFor({ timeout, state: "attached" });
      return true;
    } catch (error) {
      logger.error(`${errorMessage}: ${this.elementSearcher.locator}`);
      if (throwError) {
        throw { ...error, message: `${errorMessage}: ${error.message}}` };
      }
      return false;
    }
  }

  async waitUntilEnabled(
    timeout: number,
    {
      throwError = true,
      errorMessage = "Failed to wait for element to be enabled",
    }: IWaitUntilDisplayed = {},
  ): Promise<boolean> {
    try {
      return waiterHelper.wait(async () => this.isEnabled(), timeout);
    } catch (error) {
      logger.warn(`${errorMessage}: ${this.elementSearcher.locator}`);
      if (throwError) {
        throw { ...error, message: `${errorMessage}: ${error.message}}` };
      }
      return false;
    }
  }

  async hover(): Promise<void> {
    await (await this.element).hover();
  }
}

interface IGetValueParams {
  throwError?: boolean;
  timeout?: number;
}
