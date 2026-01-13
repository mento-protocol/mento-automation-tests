import { Page } from "@playwright/test";

export enum ElementAttribute {
  className = "class",
  id = "id",
  testId = "data-testid",
  role = "role",
  title = "title",
  name = "name",
  dataSlot = "data-slot",
}

export enum ElementTag {
  label = "label",
  div = "div",
  button = "button",
  input = "input",
  textarea = "textarea",
  iframe = "iframe",
  class = "class",
}

export interface IPwFinderParams {
  exact?: boolean;
}

export interface IPwByRoleFinderParams extends IPwFinderParams {
  name?: string;
}

export interface IBuildLocatorParams extends IPwFinderParams {
  attributeName: ElementAttribute;
  attributeValue: string;
  followBy?: ElementTag;
}

export interface ICustomFinderParams extends IPwFinderParams {
  followBy?: ElementTag;
}

export type AttributeRoles = Parameters<Page["getByRole"]>[0];
