import { MainPo } from "@pageObjects/main.po";
import { IBaseServiceArgs } from "@services/types/base.service.types";

export interface IMainServiceArgs extends IBaseServiceArgs {
  page: MainPo;
}
