import {
  IPartial,
  SearchOptions,
} from "@helpers/element-finder/types/index.types";

export interface BaseElementFinderInterface<T> {
  id: (labelName: string, params?: SearchOptions<T>) => T;
  title: (labelName: string, params?: SearchOptions<T>) => T;
  dataTestId: (labelName: string, params?: SearchOptions<T>) => T;
  className: (className: string, params?: SearchOptions<T>) => T;
  areaLabel: (labelName: string, params?: SearchOptions<T>) => T;
}

export interface IGetLocatorArgs extends IPartial {
  name: string;
  value: string;
}
