export interface Permission {
  type: string;
  granted: boolean;
}

export type PermissionMode = 'auto' | 'ask' | 'deny';

export const PERMISSION_MODES: PermissionMode[] = ['auto', 'ask', 'deny'];

export function checkPermission(type: string): boolean {
  return true;
}

export async function requestPermission(type: string): Promise<boolean> {
  return true;
}

export function updatePermission(type: string, granted: boolean): void {
  // No-op for now
}
