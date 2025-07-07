import { BrowserContext } from "@playwright/test";

import { ElementFinderInterface } from "@helpers/element-finder/types/element-finder.types";
import { timeouts } from "@constants/timeouts.constants";
import { promiseHelper } from "@helpers/promise/promise.helper";
import { loggerHelper } from "@helpers/logger/logger.helper";
import { ClassLog } from "@decorators/logger.decorators";
import { BaseElement, Label } from "@shared/web/elements/index";

const logger = loggerHelper.get("BasePage");

@ClassLog
export abstract class BasePage {
  protected abstract staticElements: BaseElement[];

  protected constructor(protected ef: ElementFinderInterface) {}

  rateLabel = new Label(this.ef.dataTestId("rateLabel"));

  async navigateToNewTab(
    currentBrowserContext: BrowserContext,
    navigateMethod: () => unknown,
  ) {
    const [newTabPage] = await Promise.all([
      currentBrowserContext.waitForEvent("page"),
      navigateMethod(),
    ]);
    return newTabPage;
  }

  async isOpen(options: IIsOpenOpts = {}): Promise<boolean> {
    let { retry = 0 } = options;
    const { timeout = timeouts.isOpenPage, shouldWaitForExist = false } =
      options;
    const isDisplayedPromises = this.staticElements.map(element => {
      return shouldWaitForExist
        ? element.waitUntilExist(timeout, { throwError: false })
        : element.waitUntilDisplayed(timeout, { throwError: false });
    });
    do {
      const result = promiseHelper.allTrue(isDisplayedPromises);
      if (result) {
        return result;
      }
    } while (retry-- > 0);
    return false;
  }

  async isNotOpen(options: IIsOpenOpts = {}): Promise<boolean> {
    let { retry = 0 } = options;
    const { timeout = timeouts.isOpenPage } = options;
    const isDisplayedPromises = this.staticElements.map(element => {
      return element.waitUntilDisappeared(timeout, { throwError: false });
    });
    do {
      const result = promiseHelper.allTrue(isDisplayedPromises);
      if (result) {
        return result;
      }
    } while (retry-- > 0);
    return false;
  }

  async verifyIsOpen(opts: IIsOpenOpts = {}): Promise<void> {
    if (!(await this.isOpen(opts))) {
      const errorMessage = `'${this.constructor.name.replace(
        "Po",
        "",
      )}' page didn't get opened - some of static elements are not there`;
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  async verifyIsClosed(opts: IIsOpenOpts = {}): Promise<void> {
    if (!(await this.isNotOpen(opts))) {
      const errorMessage = `'${this.constructor.name.replace(
        "Po",
        "",
      )}' page didn't get closed - some of static elements are still there`;
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }
  }
}

export interface IIsOpenOpts {
  retry?: number;
  timeout?: number;
  shouldWaitForExist?: boolean;
}
