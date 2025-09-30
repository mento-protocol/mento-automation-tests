import { Locator } from "@playwright/test";
import { BaseElement } from "../base/base.element";

export class ElementsList<T extends BaseElement> {
  constructor(
    protected DesiredElement: Constructable<T>,
    public element: Locator,
  ) {}

  async getElements(): Promise<Locator[]> {
    return this.element.all();
  }

  getElementByIndex(index: number): T {
    return new this.DesiredElement(this.element.nth(index));
  }

  async getLength(): Promise<number> {
    return (await this.getElements()).length;
  }

  // async getAllElements(): Promise<T[]> {
  //   return _.times(await this.getLength()).map(index =>
  //     this.getElementByIndex(index),
  //   );
  // }
}

// eslint-disable-next-line
export type Constructable<T> = new (...args: any[]) => T;
