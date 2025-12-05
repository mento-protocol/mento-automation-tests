import { Locator, Page } from "@playwright/test";

import {
  AttributeRoles,
  ElementAttribute,
  IBuildLocatorParams,
  ICustomFinderParams,
  IPwByRoleFinderParams,
  IPwFinderParams,
} from "./element-finder.helpet.types";

export class ElementFinderHelper {
  constructor(protected readonly pwPage: Page) {}

  raw(selector: string): Locator {
    return this.pwPage.locator(selector);
  }

  text(text: string | RegExp, options: IPwFinderParams = {}): Locator {
    return this.pwPage.getByText(text, options);
  }

  altText(text: string, options: IPwFinderParams = {}): Locator {
    return this.pwPage.getByAltText(text, options);
  }

  title(text: string, options: IPwFinderParams = {}): Locator {
    return this.pwPage.getByTitle(text, options);
  }

  label(text: string, options: IPwFinderParams = {}): Locator {
    return this.pwPage.getByLabel(text, options);
  }

  role(role: AttributeRoles, options: IPwByRoleFinderParams = {}): Locator {
    return this.pwPage.getByRole(role, options);
  }

  placeholder(placeholder: string, options: IPwFinderParams = {}): Locator {
    return this.pwPage.getByPlaceholder(placeholder, options);
  }

  custom(params: IBuildLocatorParams): Locator {
    return this.pwPage.locator(this.buildLocator(params));
  }

  dataTestId(
    dataTestId: string,
    { exact = true, followBy }: ICustomFinderParams = {},
  ): Locator {
    return exact
      ? this.pwPage.getByTestId(dataTestId)
      : this.custom({
          attributeName: ElementAttribute.testId,
          attributeValue: dataTestId,
          exact,
          followBy,
        });
  }

  class(className: string, { exact, followBy }: ICustomFinderParams = {}) {
    return this.custom({
      attributeName: ElementAttribute.className,
      attributeValue: className,
      exact,
      followBy,
    });
  }

  id(id: string, { exact, followBy }: ICustomFinderParams = {}) {
    return this.custom({
      attributeName: ElementAttribute.id,
      attributeValue: id,
      exact,
      followBy,
    });
  }

  name(name: string, { exact, followBy }: ICustomFinderParams = {}) {
    return this.custom({
      attributeName: ElementAttribute.name,
      attributeValue: name,
      exact,
      followBy,
    });
  }

  private buildLocator({
    attributeName,
    attributeValue,
    followBy: followingBy,
    exact = true,
  }: IBuildLocatorParams): string {
    const locatorParts: string[] = [];
    const operator = exact ? "=" : "*=";
    const attributeSelector = `[${attributeName}${operator}"${attributeValue}"]`;

    locatorParts.push(attributeSelector);
    if (followingBy) locatorParts.push(followingBy);
    return locatorParts.join(" ");
  }
}
