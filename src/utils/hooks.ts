export interface HookContext {
  event: string;
  data: any;
}
export async function triggerHook(event: string, data: any): Promise<void> {}
export function registerHook(event: string, handler: (data: any) => void): void {}
