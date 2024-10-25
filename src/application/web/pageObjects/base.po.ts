import { ElementFinderInterface } from "@helpers/element-finder/types/element-finder.types";
import { BaseElementPe } from "@pageElements/base-element.pe";
import { timeouts } from "@constants/timeouts.constants";
import { promiseHelper } from "@helpers/promise/promise.helper";
import { loggerHelper } from "@helpers/logger/logger.helper";
import { ClassLog } from "@decorators/logger.decorators";
import { BrowserContext } from "@playwright/test";

const logger = loggerHelper.get("BasePo");

@ClassLog
export abstract class BasePo {
  public abstract staticElements: BaseElementPe[];

  protected constructor(protected ef: ElementFinderInterface) {}

  async navigateToNewTab(
    currentBrowserContext: BrowserContext,
    navigateMethod: unknown,
  ) {
    const [newTabPage] = await Promise.all([
      currentBrowserContext.waitForEvent("page"),
      // @ts-ignore
      navigateMethod(),
    ]);
    return newTabPage;
  }

  async isOpen(options: IIsOpenOpts): Promise<boolean> {
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
}

interface IIsOpenOpts {
  retry?: number;
  timeout?: number;
  shouldWaitForExist?: boolean;
}
