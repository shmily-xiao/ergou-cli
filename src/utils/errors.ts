/**
 * Errors Utils - 兼容层
 */

export function isENOENT(error: unknown): boolean {
  return (error as NodeJS.ErrnoException)?.code === 'ENOENT';
}

export function isEACCES(error: unknown): boolean {
  return (error as NodeJS.ErrnoException)?.code === 'EACCES';
}

export function isEPERM(error: unknown): boolean {
  return (error as NodeJS.ErrnoException)?.code === 'EPERM';
}

export function getErrnoCode(error: unknown): string | undefined {
  return (error as NodeJS.ErrnoException)?.code;
}
