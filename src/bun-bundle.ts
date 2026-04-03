/**
 * Bun Bundle Feature Flag - 占位模块
 * 用于兼容 claude-code-sourcemap 的 feature() 调用
 */

export function feature(name: string): boolean {
  // 默认启用所有功能
  return true;
}

export interface FeatureFlags {
  PROACTIVE?: boolean;
  KAIROS?: boolean;
  KAIROS_BRIEF?: boolean;
  BRIDGE_MODE?: boolean;
  DAEMON?: boolean;
  VOICE_MODE?: boolean;
  HISTORY_SNIP?: boolean;
  WORKFLOW_SCRIPTS?: boolean;
  CCR_REMOTE_SETUP?: boolean;
  EXPERIMENTAL_SKILL_SEARCH?: boolean;
}

export const features: FeatureFlags = {
  PROACTIVE: true,
  KAIROS: true,
  KAIROS_BRIEF: true,
  BRIDGE_MODE: true,
  DAEMON: true,
  VOICE_MODE: true,
  HISTORY_SNIP: true,
  WORKFLOW_SCRIPTS: true,
  CCR_REMOTE_SETUP: true,
  EXPERIMENTAL_SKILL_SEARCH: true,
};
