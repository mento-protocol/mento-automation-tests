import { Page } from "@playwright/test";

import { IBaseElementFinderArgs, SearchOptions } from "./types/index.types";
import {
  BaseElementFinderInterface,
  IGetLocatorArgs,
} from "@helpers/element-finder/types/base-element-finder.types";

export abstract class BaseElementFinderHelper<T>
  implements BaseElementFinderInterface<T>
{
  page: Page = null;

  protected constructor(params: IBaseElementFinderArgs) {
    const { page } = params;
    this.page = page;
  }

  protected abstract search(locator: string, options?: SearchOptions<T>): T;

  id(locatorName: string, options: SearchOptions<T> = {}): T {
    return this.getLocator({ ...options, name: "id", value: locatorName });
  }

  title(locatorName: string, options: SearchOptions<T> = {}): T {
    return this.getLocator({ ...options, name: "title", value: locatorName });
  }

  name(locatorName: string, options: SearchOptions<T> = {}): T {
    return this.getLocator({ ...options, name: "name", value: locatorName });
  }

  dataTestId(locatorName: string, options: SearchOptions<T> = {}): T {
    return this.getLocator({
      ...options,
      name: "data-testid",
      value: locatorName,
    });
  }

  className(locatorName: string, options: SearchOptions<T> = {}): T {
    return this.getLocator({ ...options, name: "class", value: locatorName });
  }

  role(locatorName: string, options: SearchOptions<T> = {}): T {
    return this.getLocator({ ...options, name: "role", value: locatorName });
  }

  areaLabel(locatorName: string, options: SearchOptions<T> = {}): T {
    return this.getLocator({
      ...options,
      name: "aria-label",
      value: locatorName,
    });
  }

  private getLocator(args: IGetLocatorArgs): T {
    const { partial, value, name } = args;
    return this.search(`[${name}${partial ? "*" : ""}='${value}']`, args);
  }
}
