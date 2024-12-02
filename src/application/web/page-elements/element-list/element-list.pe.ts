import { Locator } from "@playwright/test";
import _ from "lodash";

import { Constructable, IElementList, BasePe } from "@page-elements/index";
import { IElementsSearcher } from "@helpers/element-finder/types/index.types";

export class ElementsList<T extends BasePe> implements IElementList<T> {
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
