/**
 * Tool Registry - 工具注册表
 * 实用版本 - 启用核心工具
 */

import type { Tool } from '../types/index.js';
import { BashTool } from './bash.js';
import { FileReadTool } from './file-read.js';
import { FileWriteTool } from './file-write.js';

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
    this.register('bash', new BashTool());
    this.register('file_read', new FileReadTool());
    this.register('file_write', new FileWriteTool());
    this.register('file_edit', new FileWriteTool()); // 简化版本
    
    console.log(`✅ ToolRegistry initialized with ${this.tools.size} tools`);
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
      if (tool.definition) {
        definitions.push({ name, ...tool.definition });
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
