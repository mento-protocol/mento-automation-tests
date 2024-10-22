import { BrowserContext, Page } from "@playwright/test";

export interface IBrowserArgs {
  pwPage: Page;
  context: BrowserContext;
}

export interface ISetLocalStorage {
  key: string;
  value: string;
}

export interface IScrollBy {
  x: number;
  y: number;
}

export interface IAddCookie {
  name: string;
  value: string;
  domain: string;
  path: string;
}
