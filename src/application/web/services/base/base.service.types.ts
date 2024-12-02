import { Browser } from "@helpers/browser/browser.helper";
import { BasePo } from "@page-objects/index";

export interface IBaseServiceArgs {
  browser: Browser;
  page: BasePo;
}
