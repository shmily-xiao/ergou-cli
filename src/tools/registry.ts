/**
 * Tool Registry - 核心工具版 (确保 100% 可用)
 * 
 * 极客精神：步步为营，稳扎稳打！
 */

import type { Tool } from '../types/index.js';
import { BashTool } from './bash.js';
import { FileReadTool } from './file-read.js';
import { FileWriteTool } from './file-write.js';

// 核心工具：grep (代码搜索)
import { GrepTool } from '../tools-full/GrepTool/GrepTool.js';

// 核心工具：glob (文件匹配)
import { GlobTool } from '../tools-full/GlobTool/GlobTool.js';

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
    console.log('🔧 正在注册核心工具...\n');
    
    // ========== 基础工具 ==========
    console.log('  📁 基础工具...');
    this.register('bash', new BashTool());
    this.register('file_read', new FileReadTool());
    this.register('file_write', new FileWriteTool());
    this.register('file_edit', new FileWriteTool()); // 简化版
    
    // ========== 搜索工具 ==========
    console.log('  🔍 搜索工具...');
    this.register('grep', GrepTool as any);
    this.register('glob', GlobTool as any);
    
    console.log(`\n✅ ToolRegistry initialized with ${this.tools.size} tools`);
    console.log('🎯 核心工具已启用：bash, file_read, file_write, file_edit, grep, glob\n');
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
      throw new Error(`Tool '${name}' not found. Available: ${this.list().join(', ')}`);
    }
    if (!tool.execute) {
      throw new Error(`Tool '${name}' has no execute method`);
    }
    return await tool.execute(params, context);
  }
}

export const toolRegistry = ToolRegistry.getInstance();
