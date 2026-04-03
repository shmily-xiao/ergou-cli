export function logForDebugging(...args: any[]): void {
  if (process.env.DEBUG) console.log('[DEBUG]', ...args);
}
export function debugLog(message: string, data?: any): void {
  if (process.env.DEBUG) console.log('[DEBUG]', message, data);
}
