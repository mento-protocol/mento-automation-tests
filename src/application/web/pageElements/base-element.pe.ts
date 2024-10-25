import { Locator } from "@playwright/test";
import * as console from "console";

import { ElementSearcher } from "@helpers/element-finder/types/index.types";
import { IBaseElementPe, IWaitUntilDisplayed } from "./types/base-element.pe";
import { loggerHelper } from "@helpers/logger/logger.helper";

const logger = loggerHelper.get("BaseElementPe");

export abstract class BaseElementPe implements IBaseElementPe {
  protected constructor(protected elementSearcher: ElementSearcher) {}

  protected get element(): Promise<Locator> {
    return this.elementSearcher.findElement();
  }

  async click(options: { timeout?: number } = {}): Promise<void> {
    return (await this.element).click(options);
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

  async waitUntilDisplayed(
    timeout: number,
    params: IWaitUntilDisplayed = {},
  ): Promise<boolean> {
    const { throwError = true, errorMessage = "failed to wait for element" } =
      params;

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
      errorMessage = "failed to wait for element to disappear",
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
    const { throwError = true, errorMessage = "failed to wait for element" } =
      params;

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
