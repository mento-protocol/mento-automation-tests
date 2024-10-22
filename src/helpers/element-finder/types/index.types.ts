import { Locator, Page } from "@playwright/test";
import { ElementFinderInterface } from "@helpers/element-finder/types/element-finder.types";
import { PwElementFinderHelper } from "@helpers/element-finder/pw/pw-element-finder.helper";

export type ElementSearcher = IPwElementSearcher | IElementSearcher;

export interface IPwElementSearcher {
  findElement: FindElement;
  nested: () => PwElementFinderHelper;
  locator: string;
}

export interface IElementSearcher {
  findElement: FindElement;
  nested: () => ElementFinderInterface;
  locator: string;
}

export interface IElementsSearcher {
  findElements: () => Promise<Locator[]>;
  getElementByIndex: (index: number) => IElementSearcher;
}

export interface IPartial {
  partial?: boolean;
}

export interface IElementSearchOptions extends IPartial {
  takeFirstElement?: boolean;
  frameLocator?: string;
}

export interface IElementsSearchOptions extends IPartial {}

export type SearchOptions<T> = T extends IElementSearcher
  ? IElementSearchOptions
  : IElementsSearchOptions;

export type FindElement = () => Promise<Locator>;

export interface IBaseElementFinderArgs {
  page: Page;
}

export interface IElementFinderArgs extends IBaseElementFinderArgs {
  searchRoot?: FindElement;
}

export interface IElementsFinderArgs extends IElementFinderArgs {}

export interface IPwElementFinderArgs extends IElementsFinderArgs {}
