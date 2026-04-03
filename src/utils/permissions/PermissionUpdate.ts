export interface PermissionUpdate {
  type: string;
  granted: boolean;
  timestamp: Date;
}

export function createPermissionUpdate(type: string, granted: boolean): PermissionUpdate {
  return {
    type,
    granted,
    timestamp: new Date(),
  };
}
