import { BaseElementPe } from "./base-element.pe";
import {
  ElementSearcher,
  IElementSearcher,
  IPwElementSearcher,
} from "@helpers/element-finder/types/index.types";
import { ButtonInterface } from "./types/button.types";
import { Button } from "@web/pageElements/button";
import { Locator } from "@playwright/test";

interface IDropdown {}

export class Dropdown extends BaseElementPe implements IDropdown {
  options: Record<string, Button> = null;
  constructor(args: IDropdownArgs) {
    const { dropdownButton, options } = args;
    super(dropdownButton);
    this.options = options;
  }

  async selectOptionByIndex(index: number): Promise<void> {
    await (await this.element).click();
    const entries = Object.entries(this.options);
    return entries[index][1].click();
  }

  async selectOptionByName(name: string): Promise<void> {
    await (await this.element).click();
    return this.options[name].click();
  }
}

interface IDropdownArgs {
  dropdownButton: ElementSearcher;
  options: Record<string, Button>;
}
