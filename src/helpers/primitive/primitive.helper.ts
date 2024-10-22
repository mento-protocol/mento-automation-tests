import { randomInt } from "node:crypto";

export interface IJsonStringifyOptions {
  replacer?: () => unknown;
  spaces?: number;
}

class PrimitiveHelper {
  string = {
    toBoolean(str: string): boolean {
      switch (str) {
        case "true":
          return true;
        case "false":
        case undefined:
        case "":
          return false;
        default:
          throw new Error(`wrong string: ${str}`);
      }
    },

    removeLast(source: string, charToRemove: string): string {
      if (source.length > 0 && source[source.length - 1] === charToRemove) {
        return source.slice(0, -1);
      }
      return source;
    },
  };

  getRandomFrom<T>(values: T[]): T {
    return values[randomInt(values.length)];
  }

  jsonStringify(value: unknown, options: IJsonStringifyOptions = {}): string {
    const { replacer = null, spaces = 2 } = options;
    return JSON.stringify(value, replacer, spaces);
  }
}

export const primitiveHelper = new PrimitiveHelper();
