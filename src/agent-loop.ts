/**
 * Agent Loop - 核心代理循环
 */

import type { ToolDefinition } from './registry-complete.js';
import chalk from 'chalk';

export interface AgentLoopOptions {
  provider: any;
  messages: any[];
  model: string;
  tools: ToolDefinition[];
  maxIterations: number;
  verbose: boolean;
  onContent?: (content: string) => void;
  onToolCall?: (name: string, args: Record<string, unknown>) => void;
  onToolResult?: (name: string, result: any) => void;
  executeTool?: (name: string, params: Record<string, unknown>) => Promise<any>;
}

export interface AgentResult {
  messages: any[];
  iterations: number;
  toolCallsCount: number;
  finalContent: string;
  stoppedReason: string;
}

export async function runAgentLoop(options: AgentLoopOptions): Promise<AgentResult> {
  const { provider, messages, model, tools, maxIterations, verbose } = options;
  
  let iterations = 0;
  let toolCallsCount = 0;
  let finalContent = '';
  let stoppedReason = 'end_turn';
  
  const apiTools = tools.map(t => ({
    name: t.name,
    description: t.description,
    parameters: t.inputSchema,
  }));
  
  while (iterations < maxIterations) {
    iterations++;
    
    if (verbose) {
      console.log(chalk.gray(`\n━━ Iteration ${iterations} ━━`));
    }
    
    let responseContent = '';
    const toolUses: Array<{ id: string; name: string; input: Record<string, unknown> }> = [];
    
    try {
      const stream = provider.chat(messages, {
        model,
        stream: true,
        tools: apiTools.length > 0 ? apiTools : undefined,
      });
      
      for await (const chunk of stream) {
        if (chunk.type === 'content' && chunk.content) {
          responseContent += chunk.content;
          options.onContent?.(chunk.content);
        }
        
        if (chunk.type === 'tool_use' && chunk.toolUseId && chunk.toolName) {
          toolUses.push({
            id: chunk.toolUseId,
            name: chunk.toolName,
            input: chunk.toolInput || {},
          });
        }
        
        if (chunk.type === 'error') {
          throw new Error(chunk.error?.message || 'Unknown error');
        }
        
        if (chunk.type === 'done') {
          stoppedReason = chunk.finishReason || 'end_turn';
        }
      }
    } catch (error) {
      throw new Error(`Model API error: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    if (toolUses.length === 0) {
      finalContent = responseContent;
      break;
    }
    
    toolCallsCount += toolUses.length;
    
    messages.push({
      role: 'assistant',
      content: responseContent,
    });
    
    for (const toolUse of toolUses) {
      const { id, name, input } = toolUse;
      
      options.onToolCall?.(name, input);
      
      let result: any;
      
      if (options.executeTool) {
        try {
          result = await options.executeTool(name, input);
        } catch (error) {
          result = {
            success: false,
            error: error instanceof Error ? error.message : String(error),
          };
        }
      } else {
        result = {
          success: false,
          error: `No tool executor provided`,
        };
      }
      
      options.onToolResult?.(name, result);
      
      messages.push({
        role: 'user',
        content: [
          {
            type: 'tool_result',
            tool_use_id: id,
            content: result.success !== false
              ? typeof result.output === 'string'
                ? result.output
                : JSON.stringify(result.output, null, 2)
              : `Error: ${result.error}`,
          },
        ],
      });
    }
  }
  
  if (iterations >= maxIterations) {
    stoppedReason = 'max_iterations';
    if (verbose) {
      console.log(chalk.yellow(`\n⚠️  Reached maximum iterations (${maxIterations})`));
    }
  }
  
  return {
    messages,
    iterations,
    toolCallsCount,
    finalContent,
    stoppedReason,
  };
}
