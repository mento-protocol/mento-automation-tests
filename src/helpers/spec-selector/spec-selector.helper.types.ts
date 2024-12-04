export interface IGetFilteredArgs {
  desiredSpecs: string[];
  allSpecs: string[];
}

export interface ISpecSelectorHelper {
  get: () => string[];
}
