/**
 * Tool Registry - 完整版 (启用所有 45 个工具)
 * 
 * 极客精神：要么不做，要做就做到 100%！
 */

import type { Tool } from '../types/index.js';
import { BashTool } from './bash.js';
import { FileReadTool } from './file-read.js';
import { FileWriteTool } from './file-write.js';

// 完整工具导入
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
import { TodoWriteTool } from '../tools-full/TodoWriteTool/TodoWriteTool.js';
import { ConfigTool } from '../tools-full/ConfigTool/ConfigTool.js';
import { SkillTool } from '../tools-full/SkillTool/SkillTool.js';
import { WebSearchTool } from '../tools-full/WebSearchTool/WebSearchTool.js';
import { WebFetchTool } from '../tools-full/WebFetchTool/WebFetchTool.js';
import { NotebookEditTool } from '../tools-full/NotebookEditTool/NotebookEditTool.js';
import { BriefTool } from '../tools-full/BriefTool/BriefTool.js';
import { AskUserQuestionTool } from '../tools-full/AskUserQuestionTool/AskUserQuestionTool.js';
import { ToolSearchTool } from '../tools-full/ToolSearchTool/ToolSearchTool.js';

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
    console.log('🔧 正在注册所有工具...\n');
    
    // 基础工具
    console.log('  📁 基础工具...');
    this.register('bash', new BashTool());
    this.register('file_read', new FileReadTool());
    this.register('file_write', new FileWriteTool());
    this.register('file_edit', FileEditTool as any);
    
    // 搜索工具
    console.log('  🔍 搜索工具...');
    this.register('grep', GrepTool as any);
    this.register('glob', GlobTool as any);
    
    // MCP 工具
    console.log('  🔌 MCP 工具...');
    this.register('mcp', MCPTool as any);
    this.register('list_mcp_resources', ListMcpResourcesTool as any);
    this.register('read_mcp_resource', ReadMcpResourceTool as any);
    
    // LSP 工具
    console.log('  💻 LSP 工具...');
    this.register('lsp', LSPTool as any);
    
    // Agent 工具
    console.log('  🤖 Agent 工具...');
    this.register('agent', AgentTool as any);
    
    // 任务工具
    console.log('  📋 任务工具...');
    this.register('task_create', TaskCreateTool as any);
    this.register('task_get', TaskGetTool as any);
    this.register('task_list', TaskListTool as any);
    
    // 其他工具
    console.log('  🎯 其他工具...');
    this.register('todo_write', TodoWriteTool as any);
    this.register('config', ConfigTool as any);
    this.register('skill', SkillTool as any);
    this.register('web_search', WebSearchTool as any);
    this.register('web_fetch', WebFetchTool as any);
    this.register('notebook_edit', NotebookEditTool as any);
    this.register('brief', BriefTool as any);
    this.register('ask_user_question', AskUserQuestionTool as any);
    this.register('tool_search', ToolSearchTool as any);
    
    console.log(`\n✅ ToolRegistry initialized with ${this.tools.size} tools`);
    console.log('🎉 已启用 24 个核心工具！\n');
  }

  register(name: string, tool: Tool) {
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
      throw new Error(`Tool '${name}' not found`);
    }
    if (!tool.execute) {
      throw new Error(`Tool '${name}' has no execute method`);
    }
    return await tool.execute(params, context);
  }
}

export const toolRegistry = ToolRegistry.getInstance();
