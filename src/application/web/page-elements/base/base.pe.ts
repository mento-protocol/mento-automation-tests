import { Locator } from "@playwright/test";
import * as console from "console";

import { ElementSearcher } from "@helpers/element-finder/types/index.types";
import { loggerHelper } from "@helpers/logger/logger.helper";
import {
  IBasePe,
  IClickParams,
  IWaitUntilDisplayed,
} from "@page-elements/index";

const logger = loggerHelper.get("BaseElementPe");

export abstract class BasePe implements IBasePe {
  protected constructor(protected elementSearcher: ElementSearcher) {}

  protected get element(): Promise<Locator> {
    return this.elementSearcher.findElement();
  }

  protected get locator(): string {
    return this.elementSearcher.locator;
  }

  async click({
    throwError = true,
    timeout,
  }: IClickParams = {}): Promise<void> {
    const element = await this.element;
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
      const errorMessage = `Can't click on '${this.locator}' element.\nError details: ${error.message}`;
      if (throwError) throw new Error(errorMessage);
      logger.error(errorMessage);
    }
  }

  async jsClick(): Promise<void> {
    return (await this.element).dispatchEvent("click");
  }

  async getText(): Promise<string> {
    return (await this.element).textContent();
  }

  async getValue(): Promise<string> {
    return (await this.element).inputValue();
  }

  async isDisplayed(): Promise<boolean> {
    return (await this.element).isVisible();
  }

  async isEnabled(): Promise<boolean> {
    return (await this.element).isEnabled();
  }

  async waitUntilDisplayed(
    timeout: number,
    params: IWaitUntilDisplayed = {},
  ): Promise<boolean> {
    const {
      throwError = true,
      errorMessage = "Failed to wait for element to display",
    } = params;

    try {
      await (await this.element).waitFor({ timeout, state: "visible" });
      return true;
    } catch (error) {
      logger.warn(`${errorMessage}: ${this.elementSearcher.locator}`);
      if (throwError) {
        throw { ...error, message: `${errorMessage}: ${error.message}}` };
      }
      return false;
    }
  }

  async waitUntilDisappeared(
    timeout: number,
    params: IWaitUntilDisplayed = {},
  ): Promise<boolean> {
    const {
      throwError = true,
      errorMessage = "Failed to wait for element to disappear",
    } = params;
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
    params: IWaitUntilDisplayed = {},
  ): Promise<boolean> {
    const {
      throwError = true,
      errorMessage = "Failed to wait for element to exist",
    } = params;

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

  async hover(): Promise<void> {
    await (await this.element).hover();
  }
}
