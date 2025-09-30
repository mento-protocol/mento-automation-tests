import { Locator } from "@playwright/test";
import { BaseElement } from "../base/base.element";

export class ElementsList<T extends BaseElement> {
  constructor(
    protected DesiredElement: Constructable<T>,
    public element: Locator,
  ) {}

  async getAll(): Promise<T[]> {
    const allElements = await this.element.all();
    return allElements.map(element => new this.DesiredElement(element));
  }

  getElementByIndex(index: number): T {
    return new this.DesiredElement(this.element.nth(index));
  }

  async getLength(): Promise<number> {
    return (await this.getAll()).length;
  }
}

// eslint-disable-next-line
export type Constructable<T> = new (...args: any[]) => T;
