import { Browser } from "@playwright/test";

import { ICurrent } from "@helpers/current/current.helper.types";
import { IGetApi } from "@api/get-api";

export const current: ICurrent = {
  browsers: [],
  apis: [],
  get browser(): Browser {
    return this.browsers[0];
  },
  get api(): IGetApi {
    return this.apis[0];
  },
};
