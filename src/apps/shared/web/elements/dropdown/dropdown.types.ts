import { ElementSearcher } from "@helpers/element-finder/types/index.types";
import { IGetTextParams } from "../base/base.element.types";

export interface IDropdown {
  selectOptionByIndex: (index: number) => Promise<void>;
  selectOptionByName: (
    name: string,
    params: ISelectOptionByNameParams,
  ) => Promise<void>;
  selectFirstOption: () => Promise<void>;
  selectFirstExistingOption: () => Promise<void>;
}

export interface IDropdownArgs<Options> {
  dropdownButton: ElementSearcher;
  options: Options;
}

export interface ISelectOptionByNameParams extends IGetTextParams {}
