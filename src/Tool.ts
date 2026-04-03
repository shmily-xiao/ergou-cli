/**
 * Tool System Compatibility Layer
 * 适配 claude-code-sourcemap 的 Tool 接口
 */

import type {
  Tool as BaseTool,
  ToolResult,
  ToolDefinition,
} from '../types/index.js';

// Re-export types
export type { BaseTool as Tool, ToolResult, ToolDefinition };

/**
 * 构建工具定义 (兼容 claude-code-sourcemap)
 */
export function buildTool(def: ToolDefinition): ToolDefinition {
  return def;
}

export type ToolDef = ToolDefinition;

/**
 * ValidationResult 类型
 */
export type ValidationResult = {
  result: true;
} | {
  result: false;
  message: string;
  errorCode?: number;
};
