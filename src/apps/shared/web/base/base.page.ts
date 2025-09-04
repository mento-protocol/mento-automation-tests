import { timeouts } from "@constants/timeouts.constants";
import { promiseHelper } from "@helpers/promise/promise.helper";
import { loggerHelper } from "@helpers/logger/logger.helper";
import { ClassLog } from "@decorators/logger.decorators";
import { ElementFinderHelper } from "@helpers/element-finder/element-finder.helper";
import { BaseElement, Label } from "../elements";

const log = loggerHelper.get("BasePage");

@ClassLog
export abstract class BasePage {
  protected abstract staticElements: BaseElement[];

  protected constructor(protected ef: ElementFinderHelper) {}

  rateLabel = new Label(this.ef.dataTestId("rateLabel"));

  async isOpen(options: IIsOpenOpts = {}): Promise<boolean> {
    let { retry = 0 } = options;
    const {
      timeout = timeouts.isOpenPage,
      shouldWaitForExist = false,
      shouldLog = true,
    } = options;
    const isDisplayedPromises = this.staticElements.map(element =>
      shouldWaitForExist
        ? element.waitForExist(timeout, { throwError: false, shouldLog })
        : element.waitForDisplayed(timeout, { throwError: false, shouldLog }),
    );

    do {
      const result = promiseHelper.allTrue(isDisplayedPromises);
      if (result) {
        return result;
      }
    } while (retry-- > 0);
    return false;
  }

  async isClosed(options: IIsOpenOpts = {}): Promise<boolean> {
    let { retry = 0 } = options;
    const { timeout = timeouts.isOpenPage } = options;
    const isDisplayedPromises = this.staticElements.map(element => {
      return element.waitForDisappeared(timeout, { throwError: false });
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
      log.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  async verifyIsClosed(opts: IIsOpenOpts = {}): Promise<void> {
    if (!(await this.isClosed(opts))) {
      const errorMessage = `'${this.constructor.name.replace(
        "Po",
        "",
      )}' page didn't get closed - some of static elements are still there`;
      log.error(errorMessage);
      throw new Error(errorMessage);
    }
  }
}

export interface IIsOpenOpts {
  retry?: number;
  timeout?: number;
  shouldWaitForExist?: boolean;
  shouldLog?: boolean;
}
