import { Browser } from "@playwright/test";
import { APIRequestContext } from "playwright-core";

export type SuiteFixtures = {
  pw: {
    browser: Browser;
    request: APIRequestContext;
  };
};
