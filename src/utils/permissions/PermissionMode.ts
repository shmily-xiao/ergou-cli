export type PermissionMode = 'auto' | 'ask' | 'deny';

export const DEFAULT_PERMISSION_MODE: PermissionMode = 'auto';

export function isValidPermissionMode(mode: string): mode is PermissionMode {
  return ['auto', 'ask', 'deny'].includes(mode);
}
