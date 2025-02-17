import { Browser } from "@playwright/test";

import { ICurrent } from "@helpers/current/current.helper.types";
import { IAssmbleApi } from "@api/assemble-api";

export const current: ICurrent = {
  browsers: [],
  apis: [],
  get browser(): Browser {
    return this.browsers[0];
  },
  get api(): IAssmbleApi {
    return this.apis[0];
  },
};
