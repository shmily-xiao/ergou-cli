/**
 * Fs Operations - 兼容层
 */

import { access, constants } from 'fs/promises';

export interface FsImplementation {
  readFile: (path: string) => Promise<string>;
  writeFile: (path: string, content: string) => Promise<void>;
  exists: (path: string) => Promise<boolean>;
  isDirectory: (path: string) => Promise<boolean>;
  isFile: (path: string) => Promise<boolean>;
}

export function getFsImplementation(): FsImplementation {
  return {
    async readFile(path: string) {
      const { readFile } = await import('fs/promises');
      return await readFile(path, 'utf-8');
    },
    async writeFile(path: string, content: string) {
      const { writeFile } = await import('fs/promises');
      await writeFile(path, content, 'utf-8');
    },
    async exists(path: string) {
      try {
        await access(path, constants.F_OK);
        return true;
      } catch {
        return false;
      }
    },
    async isDirectory(path: string) {
      const { stat } = await import('fs/promises');
      const stats = await stat(path);
      return stats.isDirectory();
    },
    async isFile(path: string) {
      const { stat } = await import('fs/promises');
      const stats = await stat(path);
      return stats.isFile();
    },
  };
}
