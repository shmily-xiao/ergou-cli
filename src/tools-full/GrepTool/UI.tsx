/**
 * GrepTool UI - 简化版本 (占位)
 * 完整版依赖 React/Ink，暂时使用简化版
 */

// 简化版本 - 后续整合完整 UI
export function getToolUseSummary(result: any): string {
  if (result.success && result.matches) {
    return `Found ${result.matches.length} matches`;
  }
  return 'No matches found';
}

export function renderToolResultMessage(result: any): string {
  if (result.success) {
    return result.output || 'Search completed';
  }
  return result.error || 'Search failed';
}

export function renderToolUseErrorMessage(error: any): string {
  return `Error: ${error.message || 'Unknown error'}`;
}

export function renderToolUseMessage(params: any): string {
  return `Searching for: ${params.pattern}`;
}
