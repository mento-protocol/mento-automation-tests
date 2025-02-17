import { Browser } from "@playwright/test";
import { IAssmbleApi } from "@api/assemble-api";

export interface ICurrent {
  browsers: Browser[];
  browser: Browser;
  apis: IAssmbleApi[];
  api: IAssmbleApi;
}
