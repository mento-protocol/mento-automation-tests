import fs from "fs";
import path from "node:path";

import { IGetFilePathsFromDirSyncOptions } from "@helpers/file/file.helper.types";

class FileHelper {
  getFilePathsFromDirSync(
    dirPath: string,
    options: IGetFilePathsFromDirSyncOptions = {},
  ): string[] {
    const { excludeText } = options;
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    const files: string[] = [];

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (excludeText && fullPath.includes(excludeText)) {
        continue;
      }
      if (entry.isDirectory()) {
        const subFiles = this.getFilePathsFromDirSync(fullPath, {
          excludeText,
        });
        files.push(...subFiles);
      }
      if (entry.isFile()) {
        files.push(fullPath);
      }
    }
    console.log({ files });
    return files;
  }
}

export const fileHelper = new FileHelper();
