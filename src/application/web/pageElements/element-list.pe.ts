import _ from "lodash";

import { BaseElementPe } from "./base-element.pe";
import { IElementsSearcher } from "@helpers/element-finder/types/index.types";
import { Locator } from "@playwright/test";
import { Constructable, IElementList } from "./types/component-list.types";

export class ElementsList<T extends BaseElementPe> implements IElementList<T> {
  constructor(
    protected DesiredComponent: Constructable<T>,
    public es: IElementsSearcher,
  ) {}

  get elements(): Promise<Locator[]> {
    return this.es.findElements();
  }

  getElementByIndex(index: number): T {
    return new this.DesiredComponent(this.es.getElementByIndex(index));
  }

  async getLength(): Promise<number> {
    return (await this.elements).length;
  }

  async getAllElements(): Promise<T[]> {
    return _.times(await this.getLength()).map(index =>
      this.getElementByIndex(index),
    );
  }
}
