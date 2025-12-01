import { Locator } from "@playwright/test";

import { loggerHelper } from "@helpers/logger/logger.helper";
import {
  IClickParams,
  IGetTextParams,
  IGetValueParams,
  IHoverParams,
  IWaitUntilDisplayed,
} from "../index";
import { waiterHelper } from "@helpers/waiter/waiter.helper";
import { timeouts } from "@constants/timeouts.constants";

const log = loggerHelper.get("BaseElement");

export abstract class BaseElement {
  protected constructor(protected _element: Locator) {}

  get element(): Locator {
    return this._element;
  }

  get name(): string {
    return this._element.toString();
  }

  locator(
    selectorOrLocator: string | Locator,
    options?: ILocatorOptions,
  ): Locator {
    return this._element.locator(selectorOrLocator, options);
  }

  async isDisplayed(): Promise<boolean> {
    return this._element.isVisible();
  }

  async isDisappeared(): Promise<boolean> {
    return this.element.isHidden();
  }

  async isEnabled({
    timeout = timeouts.action,
    throwError = true,
  }: IGetTextParams = {}): Promise<boolean> {
    try {
      return await this._element.isEnabled({ timeout });
    } catch (error) {
      const errorMessage = `Can't check for enabled on '${this._element}' element.\nDetails: ${error.message}`;
      log.error(errorMessage);
      if (throwError) throw new Error(errorMessage);
    }
  }

  async isDisabled({
    timeout = timeouts.action,
    throwError = true,
  }: IGetTextParams = {}): Promise<boolean> {
    try {
      return await this._element.isDisabled({ timeout });
    } catch (error) {
      const errorMessage = `Can't check for disabled on '${this._element}' element.\nDetails: ${error.message}`;
      log.error(errorMessage);
      if (throwError) throw new Error(errorMessage);
    }
  }

  async getAttribute(attribute: string): Promise<string> {
    return this._element.getAttribute(attribute);
  }

  async click({
    timeout = timeouts.xs,
    throwError = true,
    force = false,
    times,
  }: IClickParams = {}): Promise<void> {
    try {
      if (await this.waitForEnabled(timeout, { throwError: false })) {
        return await this.element.click({ timeout, clickCount: times });
      } else {
        if (force) {
          log.warn("Force clicking...");
          return await this.element.click({
            timeout,
            force,
            clickCount: times,
          });
        }
      }
      throw new Error("Element is not clickable");
    } catch (error) {
      const errorMessage = `Can't click on '${this.element}' element.\nDetails: ${error.message}`;
      log.error(errorMessage);
      if (throwError) throw new Error(errorMessage);
    }
  }

  async getText({
    timeout = timeouts.action,
    throwError = true,
  }: IGetValueParams = {}): Promise<string> {
    let text = "";
    try {
      text = await this._element.textContent({ timeout });
    } catch (error) {
      const errorMessage = `Can't get text on '${this._element}' element'.\nDetails: ${error.message}`;
      log.error(errorMessage);
      if (throwError) throw new Error(errorMessage);
      text = "";
    }
    return text;
  }

  async getValue({
    timeout = timeouts.action,
    throwError = true,
  }: IGetValueParams = {}): Promise<string> {
    try {
      return this._element.inputValue({ timeout });
    } catch (error) {
      const errorMessage = `Can't get value on '${this._element}' element'.\nDetails: ${error.message}`;
      log.error(errorMessage);
      if (throwError) throw new Error(errorMessage);
    }
  }

  async getHTML({
    timeout = timeouts.action,
    throwError = true,
  }: IGetTextParams = {}): Promise<string> {
    try {
      await this.waitForDisplayed(timeout, { throwError });
      return await this.element.innerHTML({ timeout });
    } catch (error) {
      const errorMessage = `Can't get HTML on element with '${this._element}' locator.\nError details: ${error.message}`;
      log.error(errorMessage);
      if (throwError) throw new Error(errorMessage);
    }
  }

  async hover({
    timeout = timeouts.action,
    throwError = true,
  }: IHoverParams = {}): Promise<void> {
    try {
      return await this.element.hover({ timeout });
    } catch (error) {
      const errorMessage = `Can't hover on '${this._element}' element.\nDetails: ${error.message}`;
      log.error(errorMessage);
      if (throwError) throw new Error(errorMessage);
    }
  }

  async dragTo(
    target: BaseElement,
    { throwError = true, timeout }: IHoverParams = {},
  ): Promise<void> {
    try {
      return this._element.dragTo(target.element, { timeout });
    } catch (error) {
      const errorMessage = `Can't drag to '${target}' element.\nDetails: ${error.message}`;
      log.error(errorMessage);
      if (throwError) throw new Error(errorMessage);
    }
  }

  async drag({
    direction = "right",
    pixelsDistance = 10,
    throwError = true,
    timeout,
  }: IDragParams = {}): Promise<void> {
    try {
      const sliderBox = await this._element.boundingBox();
      const centerX = sliderBox.x + sliderBox.width / 2;
      const centerY = sliderBox.y + sliderBox.height / 2;

      let targetX = centerX;
      let targetY = centerY;

      // Calculate target position based on direction
      switch (direction) {
        case "right":
          targetX = centerX + pixelsDistance;
          break;
        case "left":
          targetX = centerX - pixelsDistance;
          break;
        case "up":
          targetY = centerY - pixelsDistance;
          break;
        case "down":
          targetY = centerY + pixelsDistance;
          break;
      }

      await this._element.hover({ timeout });
      await this._element.page().mouse.down();
      await this._element.page().mouse.move(targetX, targetY);
      await this._element.page().mouse.up();
    } catch (error) {
      const errorMessage = `Can't drag slider in direction '${direction}'.\nDetails: ${error.message}`;
      log.error(errorMessage);
      if (throwError) throw new Error(errorMessage);
    }
  }

  async waitForDisplayed(
    timeout: number,
    {
      throwError = true,
      errorMessage = `Failed to wait for '${this._element}' element to display`,
      shouldLog = true,
    }: IWaitUntilDisplayed = {},
  ): Promise<boolean> {
    try {
      await this._element.waitFor({ timeout, state: "visible" });
      return true;
    } catch (error) {
      const errorLogType = throwError ? "error" : "warn";
      const message = `${errorMessage}: ${error}`;
      if (shouldLog) log[errorLogType](`${message}`);
      if (throwError) {
        throw { ...error, message: `${message}` };
      }
      return false;
    }
  }

  async waitForDisappeared(
    timeout: number,
    {
      throwError = true,
      shouldLog = true,
      errorMessage = `Failed to wait for '${this._element}' element to disappear`,
    }: IWaitUntilDisplayed = {},
  ): Promise<boolean> {
    const logType = throwError ? "error" : "warn";
    try {
      await this._element.waitFor({ timeout, state: "hidden" });
      return true;
    } catch (error) {
      const message = `${errorMessage}: ${error.message}`;
      if (shouldLog) log[logType](`${message}`);
      if (throwError) {
        throw { ...error, message };
      }
      return false;
    }
  }

  async waitForExist(
    timeout: number,
    {
      throwError = true,
      shouldLog = true,
      errorMessage = "Failed to wait for element to exist",
    }: IWaitUntilDisplayed = {},
  ): Promise<boolean> {
    try {
      await this._element.waitFor({ timeout, state: "attached" });
      return true;
    } catch (error) {
      if (shouldLog) log.error(`${errorMessage}: ${this._element}`);
      if (throwError) {
        throw { ...error, message: `${errorMessage}: ${error.message}}` };
      }
      return false;
    }
  }

  async waitForEnabled(
    timeout: number,
    {
      throwError = true,
      shouldLog = true,
      errorMessage = `Failed to wait for '${this._element}' element to be enabled`,
    }: IWaitUntilDisplayed = {},
  ): Promise<boolean> {
    const logType = throwError ? "error" : "warn";
    try {
      return await waiterHelper.wait(async () => this.isEnabled(), timeout);
    } catch (error) {
      const message = `${errorMessage}: ${error}`;

      if (shouldLog) log[logType](`${message}`);
      if (throwError) {
        throw { ...error, message };
      }
      return false;
    }
  }

  // async click2({
  //   timeout = timeouts.xs,
  //   force = false,
  //   times,
  //   retry = 1,
  // }: IClickParams = {}): Promise<void> {
  //   return retry
  //     ? await waiterHelper.retry(async () => {
  //         return await this.baseClick({ timeout, force, times });
  //       }, retry)
  //     : await this.baseClick({ timeout, force, times });
  // }

  // private async baseClick({
  //   timeout = timeouts.xs,
  //   throwError = true,
  //   force = false,
  //   times,
  //   retry = 1,
  // }: IClickParams = {}): Promise<void> {
  //   try {
  //     console.log("start");
  //     if (await this.isEnabled({ timeout })) {
  //       console.log("enabled");
  //       return await this.element.click({ timeout, clickCount: times });
  //     } else {
  //       console.log("disabled");
  //       if (force) {
  //         console.log("force", force);
  //         return await this.element.click({
  //           timeout,
  //           force,
  //           clickCount: times,
  //         });
  //       }
  //     }
  //   } catch (error) {
  //     const errorMessage = `Can't click on '${this.element}' element.\nDetails: ${error.message}`;
  //     if (throwError) throw new Error(errorMessage);
  //     log.error(errorMessage);
  //   }
  // }
}

interface ILocatorOptions {
  has?: Locator;
  hasNot?: Locator;
  hasNotText?: string | RegExp;
  hasText?: string | RegExp;
}

interface IDragParams extends IHoverParams {
  direction?: "right" | "left" | "up" | "down";
  pixelsDistance?: number;
}
