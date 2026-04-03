/**
 * Cwd Utils - 兼容层
 */

export function getCwd(): string {
  return process.cwd();
}

export function setCwd(path: string): void {
  process.chdir(path);
}
