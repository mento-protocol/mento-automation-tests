import { loggerHelper } from "@helpers/logger/logger.helper";
import { BasePe, IDropdown, IDropdownArgs } from "@page-elements/index";

const logger = loggerHelper.get("DropdownPe");

export class Dropdown<Options> extends BasePe implements IDropdown {
  readonly options: Options = null;
  constructor(args: IDropdownArgs<Options>) {
    const { dropdownButton, options } = args;
    super(dropdownButton);
    this.options = options;
  }

  async selectOptionByIndex(index: number): Promise<void> {
    await super.click();
    const entries = Object.entries(this.options);
    return entries[index][1].click();
  }

  async selectFirstOption(): Promise<void> {
    await super.click();
    const entries = Object.entries(this.options);
    return entries[0][1].click();
  }

  async selectFirstExistingOption(): Promise<void> {
    await super.click();
    for (const [optionName, option] of Object.entries(this.options)) {
      if (option.isDisplayed()) {
        return option.click();
      }
      logger.debug(`'${optionName}' option is not displayed - taking next one`);
    }
  }

  async selectOptionByName(name: string): Promise<void> {
    await super.click();
    return this.options[name].click();
  }
}
