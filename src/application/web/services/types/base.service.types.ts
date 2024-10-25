import { Browser } from "@helpers/browser/browser.helper";
import { BasePo } from "@pageObjects/base.po";

export interface IBaseServiceArgs {
  browser: Browser;
  page: BasePo;
}
