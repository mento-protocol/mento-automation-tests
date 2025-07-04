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

  number = {
    toAmount(value: string): number {
      if (value.includes(",")) return Number(value.replace(/,/g, ""));
      return Number(value);
    },

    hasExactDecimalNumber(
      value: string | number,
      decimalPlaces: number,
    ): boolean {
      if (typeof value === "number") {
        value = value.toString();
      }

      // Handle invalid inputs
      if (!value || isNaN(Number(value))) {
        return false;
      }

      // Split by decimal point
      const parts = value.split(".");

      // If no decimal point, check if we expect 0 decimal places
      if (parts.length === 1) {
        return decimalPlaces === 0;
      }

      // Check if decimal part has exactly the specified length
      return parts[1].length === decimalPlaces;
    },

    hasMaxDecimalPlaces(
      value: string | number,
      maxDecimalPlaces: number,
    ): boolean {
      if (typeof value === "number") {
        value = value.toString();
      }

      // Handle invalid inputs
      if (!value || isNaN(Number(value))) {
        return false;
      }

      // Split by decimal point
      const parts = value.split(".");

      // If no decimal point, it's valid (has 0 decimal places)
      if (parts.length === 1) {
        return true;
      }

      // Check if decimal part has no more than the specified length
      return parts[1].length <= maxDecimalPlaces;
    },
  };

  getRandomFrom<T>(values: T[]): T {
    return values[randomInt(values.length)];
  }

  getCurrentDateTime(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hour = String(now.getHours()).padStart(2, "0");
    const minute = String(now.getMinutes()).padStart(2, "0");
    const second = String(now.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }

  getCurrenTime(): string {
    const now = new Date();
    const hour = String(now.getHours()).padStart(2, "0");
    const minute = String(now.getMinutes()).padStart(2, "0");
    const second = String(now.getSeconds()).padStart(2, "0");

    return `${hour}:${minute}:${second}`;
  }

  jsonStringify(value: unknown, options: IJsonStringifyOptions = {}): string {
    const { replacer = null, spaces = 2 } = options;
    return JSON.stringify(value, replacer, spaces);
  }
}

export const primitiveHelper = new PrimitiveHelper();
