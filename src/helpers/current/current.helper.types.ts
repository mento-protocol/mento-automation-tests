import { Browser } from "@playwright/test";
import { IGetApi } from "@api/get-api";

export interface ICurrent {
  browsers: Browser[];
  browser: Browser;
  apis: IGetApi[];
  api: IGetApi;
}
