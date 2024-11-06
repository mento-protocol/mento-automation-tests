import { ElementSearcher } from "@helpers/element-finder/types/index.types";

export interface IDropdown {
  selectOptionByIndex: (index: number) => Promise<void>;
  selectOptionByName: (name: string) => Promise<void>;
  selectFirstOption: () => Promise<void>;
  selectFirstExistingOption: () => Promise<void>;
}

export interface IDropdownArgs<Options> {
  dropdownButton: ElementSearcher;
  options: Options;
}
