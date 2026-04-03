/**
 * Tool Registry - 完整工具注册表
 * 基于 claude-code-sourcemap 完整工具代码
 */

import type { Tool } from '../types/index.js';

// 导入完整工具
import { BashTool } from './tools-full/BashTool/BashTool.js';
import { FileReadTool } from './tools-full/FileReadTool/FileReadTool.js';
import { FileWriteTool } from './tools-full/FileWriteTool/FileWriteTool.js';
import { FileEditTool } from './tools-full/FileEditTool/FileEditTool.js';
// GrepTool 使用特殊处理，暂时跳过
// import { GrepTool } from './tools-full/GrepTool/GrepTool.js';
import { GlobTool } from './tools-full/GlobTool/GlobTool.js';
import { MCPTool } from './tools-full/MCPTool/MCPTool.js';
import { ListMcpResourcesTool } from './tools-full/ListMcpResourcesTool/ListMcpResourcesTool.js';
import { ReadMcpResourceTool } from './tools-full/ReadMcpResourceTool/ReadMcpResourceTool.js';
import { LSPTool } from './tools-full/LSPTool/LSPTool.js';
import { AgentTool } from './tools-full/AgentTool/AgentTool.js';
import { TaskCreateTool } from './tools-full/TaskCreateTool/TaskCreateTool.js';
import { TaskGetTool } from './tools-full/TaskGetTool/TaskGetTool.js';
import { TaskListTool } from './tools-full/TaskListTool/TaskListTool.js';
import { TaskOutputTool } from './tools-full/TaskOutputTool/TaskOutputTool.js';
import { TaskStopTool } from './tools-full/TaskStopTool/TaskStopTool.js';
import { TaskUpdateTool } from './tools-full/TaskUpdateTool/TaskUpdateTool.js';
import { TodoWriteTool } from './tools-full/TodoWriteTool/TodoWriteTool.js';
import { ConfigTool } from './tools-full/ConfigTool/ConfigTool.js';
import { SkillTool } from './tools-full/SkillTool/SkillTool.js';
import { WebSearchTool } from './tools-full/WebSearchTool/WebSearchTool.js';
import { WebFetchTool } from './tools-full/WebFetchTool/WebFetchTool.js';
import { SendMessageTool } from './tools-full/SendMessageTool/SendMessageTool.js';
import { NotebookEditTool } from './tools-full/NotebookEditTool/NotebookEditTool.js';
import { BriefTool } from './tools-full/BriefTool/BriefTool.js';
import { AskUserQuestionTool } from './tools-full/AskUserQuestionTool/AskUserQuestionTool.js';
import { EnterPlanModeTool } from './tools-full/EnterPlanModeTool/EnterPlanModeTool.js';
import { ExitPlanModeTool } from './tools-full/ExitPlanModeTool/ExitPlanModeV2Tool.js';
import { ToolSearchTool } from './tools-full/ToolSearchTool/ToolSearchTool.js';

/**
 * 工具注册表类
 */
export class ToolRegistry {
  private static instance: ToolRegistry;
  private tools: Map<string, Tool> = new Map();

  private constructor() {
    this.registerDefaultTools();
  }

  static getInstance(): ToolRegistry {
    if (!ToolRegistry.instance) {
      ToolRegistry.instance = new ToolRegistry();
    }
    return ToolRegistry.instance;
  }

  private registerDefaultTools() {
    // ========== 基础工具 ==========
    this.register('bash', new BashTool());
    this.register('file_read', new FileReadTool());
    this.register('file_write', new FileWriteTool());
    this.register('file_edit', new FileEditTool());
    
    // ========== 搜索工具 ==========
    this.register('grep', new GrepTool());
    this.register('glob', new GlobTool());
    
    // ========== MCP 工具 ==========
    this.register('mcp', new MCPTool());
    this.register('list_mcp_resources', new ListMcpResourcesTool());
    this.register('read_mcp_resource', new ReadMcpResourceTool());
    
    // ========== LSP 工具 ==========
    this.register('lsp', new LSPTool());
    
    // ========== Agent 工具 ==========
    this.register('agent', new AgentTool());
    
    // ========== 任务工具 ==========
    this.register('task_create', new TaskCreateTool());
    this.register('task_get', new TaskGetTool());
    this.register('task_list', new TaskListTool());
    this.register('task_output', new TaskOutputTool());
    this.register('task_stop', new TaskStopTool());
    this.register('task_update', new TaskUpdateTool());
    
    // ========== TODO 工具 ==========
    this.register('todo_write', new TodoWriteTool());
    
    // ========== 配置工具 ==========
    this.register('config', new ConfigTool());
    
    // ========== 技能工具 ==========
    this.register('skill', new SkillTool());
    
    // ========== 网络工具 ==========
    this.register('web_search', new WebSearchTool());
    this.register('web_fetch', new WebFetchTool());
    
    // ========== 通讯工具 ==========
    this.register('send_message', new SendMessageTool());
    
    // ========== 笔记本工具 ==========
    this.register('notebook_edit', new NotebookEditTool());
    
    // ========== 简报工具 ==========
    this.register('brief', new BriefTool());
    
    // ========== 用户交互工具 ==========
    this.register('ask_user_question', new AskUserQuestionTool());
    
    // ========== 计划模式工具 ==========
    this.register('enter_plan_mode', new EnterPlanModeTool());
    this.register('exit_plan_mode', new ExitPlanModeTool());
    
    // ========== 工具搜索 ==========
    this.register('tool_search', new ToolSearchTool());
    
    console.log(`✅ ToolRegistry initialized with ${this.tools.size} tools`);
  }

  register(name: string, tool: Tool) {
    if (this.tools.has(name)) {
      console.warn(`⚠️  Tool '${name}' already registered, overwriting...`);
    }
    this.tools.set(name, tool);
  }

  get(name: string): Tool | undefined {
    return this.tools.get(name);
  }

  list(): string[] {
    return Array.from(this.tools.keys());
  }

  getToolDefinitions(): any[] {
    const definitions: any[] = [];
    for (const [name, tool] of this.tools.entries()) {
      if (tool.definition) {
        definitions.push({
          name,
          ...tool.definition,
        });
      }
    }
    return definitions;
  }

  async execute(name: string, params: Record<string, any>, context?: any): Promise<any> {
    const tool = this.get(name);
    if (!tool) {
      throw new Error(`Tool '${name}' not found. Available: ${this.list().join(', ')}`);
    }
    if (!tool.execute) {
      throw new Error(`Tool '${name}' has no execute method`);
    }
    return await tool.execute(params, context);
  }
}

export const toolRegistry = ToolRegistry.getInstance();
nstance();
