/**
 * Path Utils - 兼容层
 */

import { join, relative, isAbsolute } from 'path';

export function expandPath(path: string, baseDir?: string): string {
  if (isAbsolute(path)) {
    return path;
  }
  
  if (path.startsWith('~')) {
    const homedir = require('os').homedir();
    return join(homedir, path.slice(1));
  }
  
  return baseDir ? join(baseDir, path) : path;
}

export function toRelativePath(path: string, baseDir?: string): string {
  const cwd = baseDir || process.cwd();
  return relative(cwd, path);
}

export function normalizePath(path: string): string {
  return path.replace(/\\/g, '/');
}
