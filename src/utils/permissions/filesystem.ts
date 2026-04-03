/**
 * Filesystem Permissions - 兼容层
 */

import { access, constants } from 'fs/promises';

export async function checkReadPermissionForTool(path: string): Promise<boolean> {
  try {
    await access(path, constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

export async function checkWritePermissionForTool(path: string): Promise<boolean> {
  try {
    await access(path, constants.W_OK);
    return true;
  } catch {
    return false;
  }
}

export async function checkExecutePermissionForTool(path: string): Promise<boolean> {
  try {
    await access(path, constants.X_OK);
    return true;
  } catch {
    return false;
  }
}

export function getFileReadIgnorePatterns(): string[] {
  return [
    'node_modules',
    '.git',
    '.svn',
    '.hg',
    '__pycache__',
    '*.pyc',
    '*.pyo',
    '.DS_Store',
    '*.log',
  ];
}

export function normalizePatternsToPath(patterns: string[]): string[] {
  return patterns.map(p => {
    if (p.startsWith('**/')) {
      return p.slice(3);
    }
    return p;
  });
}

export type PermissionDecision = 'allow' | 'deny' | 'allow_session' | 'allow_always';
