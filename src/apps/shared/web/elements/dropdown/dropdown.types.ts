import { Locator } from "@playwright/test";
import { IGetTextParams } from "../base/base.element.types";

export interface IDropdownArgs<Options> {
  dropdownButton: Locator;
  options: Options;
}

export interface ISelectOptionByNameParams extends IGetTextParams {}
