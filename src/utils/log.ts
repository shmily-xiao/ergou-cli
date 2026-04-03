export function logError(error: Error | string): void {
  console.error('[ERROR]', error);
}
export function logInfo(message: string): void {
  console.log('[INFO]', message);
}
export function logWarn(message: string): void {
  console.warn('[WARN]', message);
}
