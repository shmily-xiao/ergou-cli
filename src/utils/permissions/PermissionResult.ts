/**
 * Permission Result - 兼容层
 */

export type PermissionDecision = 'allow' | 'deny' | 'allow_session' | 'allow_always';

export interface PermissionResult {
  decision: PermissionDecision;
  reason?: string;
  autoApproved?: boolean;
}

export function createPermissionResult(
  decision: PermissionDecision,
  reason?: string,
  autoApproved?: boolean
): PermissionResult {
  return {
    decision,
    reason,
    autoApproved,
  };
}
