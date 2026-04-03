/**
 * File Utils - 兼容层
 */

import { readFile } from 'fs/promises';
import { join } from 'path';

export const FILE_NOT_FOUND_CWD_NOTE = 'File not found in current working directory';

export function suggestPathUnderCwd(pattern: string): string {
  return `Try searching from current directory: ${pattern}`;
}

export async function fileExists(path: string): Promise<boolean> {
  try {
    await readFile(path);
    return true;
  } catch {
    return false;
  }
}

export function isBinaryFile(path: string): boolean {
  const binaryExtensions = [
    '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.ico', '.webp',
    '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
    '.zip', '.tar', '.gz', '.rar', '.7z',
    '.exe', '.dll', '.so', '.dylib',
    '.mp3', '.mp4', '.avi', '.mov', '.wmv', '.flv',
  ];
  const ext = path.substring(path.lastIndexOf('.')).toLowerCase();
  return binaryExtensions.includes(ext);
}

export function hasBinaryExtension(path: string): boolean {
  return isBinaryFile(path);
}
