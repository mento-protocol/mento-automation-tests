export interface IWaitUntilDisplayed {
  errorMessage?: string;
  throwError?: boolean;
}

export interface IBasePe {
  getText: () => Promise<string>;
  hover: () => Promise<void>;
  waitUntilDisplayed: (
    timeout: number,
    params?: IWaitUntilDisplayed,
  ) => Promise<boolean>;
  isDisplayed: () => Promise<boolean>;
  isEnabled: () => Promise<boolean>;
}

export interface IClickParams {
  timeout?: number;
  force?: boolean;
  throwError?: boolean;
}

export interface IGetTextParams {
  timeout?: number;
  throwError?: boolean;
}
