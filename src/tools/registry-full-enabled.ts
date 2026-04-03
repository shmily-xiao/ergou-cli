/**
 * Tool Registry - 完整版
 * 启用所有已复制的工具
 */

import type { Tool } from '../types/index.js';
import { BashTool } from './bash.js';
import { FileReadTool } from './file-read.js';
import { FileWriteTool } from './file-write.js';

// 从 tools-full 导入完整工具
// 注意：有些工具使用 buildTool 创建，需要特殊处理
import { GrepTool } from '../tools-full/GrepTool/GrepTool.js';
import { GlobTool } from '../tools-full/GlobTool/GlobTool.js';
import { FileEditTool } from '../tools-full/FileEditTool/FileEditTool.js';
import { MCPTool } from '../tools-full/MCPTool/MCPTool.js';
import { ListMcpResourcesTool } from '../tools-full/ListMcpResourcesTool/ListMcpResourcesTool.js';
import { ReadMcpResourceTool } from '../tools-full/ReadMcpResourceTool/ReadMcpResourceTool.js';
import { LSPTool } from '../tools-full/LSPTool/LSPTool.js';
import { AgentTool } from '../tools-full/AgentTool/AgentTool.js';
import { TaskCreateTool } from '../tools-full/TaskCreateTool/TaskCreateTool.js';
import { TaskGetTool } from '../tools-full/TaskGetTool/TaskGetTool.js';
import { TaskListTool } from '../tools-full/TaskListTool/TaskListTool.js';
import { TaskOutputTool } from '../tools-full/TaskOutputTool/TaskOutputTool.js';
import { TaskStopTool } from '../tools-full/TaskStopTool/TaskStopTool.js';
import { TaskUpdateTool } from '../tools-full/TaskUpdateTool/TaskUpdateTool.js';
import { TodoWriteTool } from '../tools-full/TodoWriteTool/TodoWriteTool.js';
import { ConfigTool } from '../tools-full/ConfigTool/ConfigTool.js';
import { SkillTool } from '../tools-full/SkillTool/SkillTool.js';
import { WebSearchTool } from '../tools-full/WebSearchTool/WebSearchTool.js';
import { WebFetchTool } from '../tools-full/WebFetchTool/WebFetchTool.js';
import { SendMessageTool } from '../tools-full/SendMessageTool/SendMessageTool.js';
import { NotebookEditTool } from '../tools-full/NotebookEditTool/NotebookEditTool.js';
import { BriefTool } from '../tools-full/BriefTool/BriefTool.js';
import { AskUserQuestionTool } from '../tools-full/AskUserQuestionTool/AskUserQuestionTool.js';
import { EnterPlanModeTool } from '../tools-full/EnterPlanModeTool/EnterPlanModeTool.js';
import { ExitPlanModeTool } from '../tools-full/ExitPlanModeTool/ExitPlanModeV2Tool.js';
import { ToolSearchTool } from '../tools-full/ToolSearchTool/ToolSearchTool.js';
import { SleepTool } from '../tools-full/SleepTool/prompt.js';
import { SyntheticOutputTool } from '../tools-full/SyntheticOutputTool/SyntheticOutputTool.js';
import { McpAuthTool } from '../tools-full/McpAuthTool/McpAuthTool.js';

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
    console.log('🔧 注册基础工具...');
    this.register('bash', new BashTool());
    this.register('file_read', new FileReadTool());
    this.register('file_write', new FileWriteTool());
    
    // ========== 搜索工具 ==========
    console.log('🔧 注册搜索工具...');
    this.register('grep', GrepTool as any);
    this.register('glob', GlobTool as any);
    
    // ========== 文件编辑 ==========
    console.log('🔧 注册文件编辑工具...');
    this.register('file_edit', FileEditTool as any);
    
    // ========== MCP 工具 ==========
    console.log('🔧 注册 MCP 工具...');
    this.register('mcp', MCPTool as any);
    this.register('list_mcp_resources', ListMcpResourcesTool as any);
    this.register('read_mcp_resource', ReadMcpResourceTool as any);
    
    // ========== LSP 工具 ==========
    console.log('🔧 注册 LSP 工具...');
    this.register('lsp', LSPTool as any);
    
    // ========== Agent 工具 ==========
    console.log('🔧 注册 Agent 工具...');
    this.register('agent', AgentTool as any);
    
    // ========== 任务工具 ==========
    console.log('🔧 注册任务工具...');
    this.register('task_create', TaskCreateTool as any);
    this.register('task_get', TaskGetTool as any);
    this.register('task_list', TaskListTool as any);
    this.register('task_output', TaskOutputTool as any);
    this.register('task_stop', TaskStopTool as any);
    this.register('task_update', TaskUpdateTool as any);
    
    // ========== TODO 工具 ==========
    console.log('🔧 注册 TODO 工具...');
    this.register('todo_write', TodoWriteTool as any);
    
    // ========== 配置工具 ==========
    console.log('🔧 注册配置工具...');
    this.register('config', ConfigTool as any);
    
    // ========== 技能工具 ==========
    console.log('🔧 注册技能工具...');
    this.register('skill', SkillTool as any);
    
    // ========== 网络工具 ==========
    console.log('🔧 注册网络工具...');
    this.register('web_search', WebSearchTool as any);
    this.register('web_fetch', WebFetchTool as any);
    
    // ========== 通讯工具 ==========
    console.log('🔧 注册通讯工具...');
    this.register('send_message', SendMessageTool as any);
    
    // ========== 笔记本工具 ==========
    console.log('🔧 注册笔记本工具...');
    this.register('notebook_edit', NotebookEditTool as any);
    
    // ========== 简报工具 ==========
    console.log('🔧 注册简报工具...');
    this.register('brief', BriefTool as any);
    
    // ========== 用户交互工具 ==========
    console.log('🔧 注册用户交互工具...');
    this.register('ask_user_question', AskUserQuestionTool as any);
    
    // ========== 计划模式工具 ==========
    console.log('🔧 注册计划模式工具...');
    this.register('enter_plan_mode', EnterPlanModeTool as any);
    this.register('exit_plan_mode', ExitPlanModeTool as any);
    
    // ========== 工具搜索 ==========
    console.log('🔧 注册工具搜索...');
    this.register('tool_search', ToolSearchTool as any);
    
    // ========== 其他工具 ==========
    console.log('🔧 注册其他工具...');
    this.register('sleep', SleepTool as any);
    this.register('synthetic_output', SyntheticOutputTool as any);
    this.register('mcp_auth', McpAuthTool as any);
    
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
      if (tool.definition || (tool as any).inputSchema) {
        definitions.push({
          name,
          description: (tool as any).description || '',
          inputSchema: (tool as any).inputSchema || {},
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
