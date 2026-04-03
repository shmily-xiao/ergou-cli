/**
 * Tool System - 工具系统统一导出
 * 基于 claude-code-sourcemap 完整工具代码
 */

// ========== 导出所有工具 ==========

// BashTool
export { BashTool } from './tools-full/BashTool/BashTool.js';
export * from './tools-full/BashTool/prompt.js';
export * from './tools-full/BashTool/toolName.js';

// FileReadTool
export { FileReadTool } from './tools-full/FileReadTool/FileReadTool.js';
export * from './tools-full/FileReadTool/prompt.js';

// FileWriteTool
export { FileWriteTool } from './tools-full/FileWriteTool/FileWriteTool.js';
export * from './tools-full/FileWriteTool/prompt.js';

// FileEditTool
export { FileEditTool } from './tools-full/FileEditTool/FileEditTool.js';
export * from './tools-full/FileEditTool/prompt.js';
export * from './tools-full/FileEditTool/types.js';
export * from './tools-full/FileEditTool/constants.js';

// GrepTool
export { GrepTool } from './tools-full/GrepTool/GrepTool.js';
export * from './tools-full/GrepTool/prompt.js';

// GlobTool
export { GlobTool } from './tools-full/GlobTool/GlobTool.js';
export * from './tools-full/GlobTool/prompt.js';

// MCPTool
export { MCPTool } from './tools-full/MCPTool/MCPTool.js';
export * from './tools-full/MCPTool/prompt.js';

// ListMcpResourcesTool
export { ListMcpResourcesTool } from './tools-full/ListMcpResourcesTool/ListMcpResourcesTool.js';

// ReadMcpResourceTool
export { ReadMcpResourceTool } from './tools-full/ReadMcpResourceTool/ReadMcpResourceTool.js';

// LSPTool
export { LSPTool } from './tools-full/LSPTool/LSPTool.js';
export * from './tools-full/LSPTool/prompt.js';
export * from './tools-full/LSPTool/schemas.js';

// AgentTool
export { AgentTool } from './tools-full/AgentTool/AgentTool.js';
export * from './tools-full/AgentTool/prompt.js';
export * from './tools-full/AgentTool/loadAgentsDir.js';
export * from './tools-full/AgentTool/builtInAgents.js';

// Task Tools
export { TaskCreateTool } from './tools-full/TaskCreateTool/TaskCreateTool.js';
export { TaskGetTool } from './tools-full/TaskGetTool/TaskGetTool.js';
export { TaskListTool } from './tools-full/TaskListTool/TaskListTool.js';
export { TaskOutputTool } from './tools-full/TaskOutputTool/TaskOutputTool.js';
export { TaskStopTool } from './tools-full/TaskStopTool/TaskStopTool.js';
export { TaskUpdateTool } from './tools-full/TaskUpdateTool/TaskUpdateTool.js';

// Team Tools
export { TeamCreateTool } from './tools-full/TeamCreateTool/TeamCreateTool.js';
export { TeamDeleteTool } from './tools-full/TeamDeleteTool/TeamDeleteTool.js';

// TodoWriteTool
export { TodoWriteTool } from './tools-full/TodoWriteTool/TodoWriteTool.js';

// ConfigTool
export { ConfigTool } from './tools-full/ConfigTool/ConfigTool.js';

// SkillTool
export { SkillTool } from './tools-full/SkillTool/SkillTool.js';

// WebSearchTool
export { WebSearchTool } from './tools-full/WebSearchTool/WebSearchTool.js';

// WebFetchTool
export { WebFetchTool } from './tools-full/WebFetchTool/WebFetchTool.js';

// SendMessageTool
export { SendMessageTool } from './tools-full/SendMessageTool/SendMessageTool.js';

// ScheduleCronTool
export { ScheduleCronTool } from './tools-full/ScheduleCronTool/CronCreateTool.js';
export { CronDeleteTool } from './tools-full/ScheduleCronTool/CronDeleteTool.js';
export { CronListTool } from './tools-full/ScheduleCronTool/CronListTool.js';

// NotebookEditTool
export { NotebookEditTool } from './tools-full/NotebookEditTool/NotebookEditTool.js';

// PowerShellTool (Windows)
export { PowerShellTool } from './tools-full/PowerShellTool/PowerShellTool.js';

// REPLTool
export { REPLTool } from './tools-full/REPLTool/primitiveTools.js';

// BriefTool
export { BriefTool } from './tools-full/BriefTool/BriefTool.js';

// AskUserQuestionTool
export { AskUserQuestionTool } from './tools-full/AskUserQuestionTool/AskUserQuestionTool.js';

// EnterPlanModeTool / ExitPlanModeTool
export { EnterPlanModeTool } from './tools-full/EnterPlanModeTool/EnterPlanModeTool.js';
export { ExitPlanModeTool } from './tools-full/ExitPlanModeTool/ExitPlanModeV2Tool.js';

// EnterWorktreeTool / ExitWorktreeTool
export { EnterWorktreeTool } from './tools-full/EnterWorktreeTool/EnterWorktreeTool.js';
export { ExitWorktreeTool } from './tools-full/ExitWorktreeTool/ExitWorktreeTool.js';

// RemoteTriggerTool
export { RemoteTriggerTool } from './tools-full/RemoteTriggerTool/RemoteTriggerTool.js';

// ToolSearchTool
export { ToolSearchTool } from './tools-full/ToolSearchTool/ToolSearchTool.js';

// SleepTool
export { SleepTool } from './tools-full/SleepTool/prompt.js';

// SyntheticOutputTool
export { SyntheticOutputTool } from './tools-full/SyntheticOutputTool/SyntheticOutputTool.js';

// McpAuthTool
export { McpAuthTool } from './tools-full/McpAuthTool/McpAuthTool.js';

// Testing (optional)
// export { TestingPermissionTool } from './tools-full/testing/TestingPermissionTool.js';

// ========== 导出 Utils ==========

// Git
export * from './tools-full/shared/gitOperationTracking.js';

// Multi-Agent
export * from './tools-full/shared/spawnMultiAgent.js';

// ========== 工具常量 ==========

export const AVAILABLE_TOOLS = [
  'bash',
  'file_read',
  'file_write',
  'file_edit',
  'grep',
  'glob',
  'mcp',
  'list_mcp_resources',
  'read_mcp_resource',
  'lsp',
  'agent',
  'task_create',
  'task_get',
  'task_list',
  'task_output',
  'task_stop',
  'task_update',
  'team_create',
  'team_delete',
  'todo_write',
  'config',
  'skill',
  'web_search',
  'web_fetch',
  'send_message',
  'schedule_cron',
  'cron_delete',
  'cron_list',
  'notebook_edit',
  'brief',
  'ask_user_question',
  'enter_plan_mode',
  'exit_plan_mode',
  'enter_worktree',
  'exit_worktree',
  'remote_trigger',
  'tool_search',
  'sleep',
  'synthetic_output',
  'mcp_auth',
];
