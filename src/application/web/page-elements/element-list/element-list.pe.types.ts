// eslint-disable-next-line
export type Constructable<T> = new (...args: any[]) => T;

export interface IElementList<T> {
  getElementByIndex: (index: number) => T;
  getLength: () => Promise<number>;
  getAllElements: () => Promise<T[]>;
}
