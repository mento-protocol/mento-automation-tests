import { BaseElementPe } from "@pageElements//base-element.pe";
import { ElementSearcher } from "@helpers/element-finder/types/index.types";
import { loggerHelper } from "@helpers/logger/logger.helper";

const logger = loggerHelper.get("DropdownPe");

interface IDropdown {}

export class Dropdown<O> extends BaseElementPe implements IDropdown {
  readonly options: O = null;
  constructor(args: IDropdownArgs<O>) {
    const { dropdownButton, options } = args;
    super(dropdownButton);
    this.options = options;
  }

  async selectOptionByIndex(index: number): Promise<void> {
    await (await this.element).click();
    const entries = Object.entries(this.options);
    return entries[index][1].click();
  }

  async selectFirstOption(): Promise<void> {
    await (await this.element).click();
    const entries = Object.entries(this.options);
    return entries[0][1].click();
  }

  async selectFirstExistingOption(): Promise<void> {
    await (await this.element).click();
    for (const [optionName, option] of Object.entries(this.options)) {
      if (option.isDisplayed()) {
        return option.click();
      }
      logger.debug(`'${optionName}' option is not displayed - taking next one`);
    }
  }

  async selectOptionByName(name: string): Promise<void> {
    await (await this.element).click();
    return this.options[name].click();
  }
}

interface IDropdownArgs<Options> {
  dropdownButton: ElementSearcher;
  options: Options;
}
