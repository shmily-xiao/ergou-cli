/**
 * 阿里云 DashScope Provider 实现
 * 支持 Qwen 系列模型
 */

import { BaseModelProvider, ProviderRegistry } from './base';
import type {
  ModelInfo,
  Message,
  ChatOptions,
  ChatChunk,
  TokenUsage,
  CostInfo,
  ProviderConfig,
} from '@/types';

export class AliyunProvider extends BaseModelProvider {
  private static readonly DEFAULT_BASE_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1';
  
  private apiKey: string;
  private baseUrl: string;

  constructor(config: ProviderConfig) {
    super('aliyun', 'qwen3.5-plus', config);
    
    this.apiKey = config.apiKey || process.env.DASHSCOPE_API_KEY || '';
    this.baseUrl = config.baseUrl || AliyunProvider.DEFAULT_BASE_URL;
    
    if (!this.apiKey) {
      throw new Error(
        'Aliyun API key is required. Set DASHSCOPE_API_KEY environment variable or provide apiKey in config.'
      );
    }
  }

  async listModels(): Promise<ModelInfo[]> {
    const models: ModelInfo[] = [
      {
        id: 'qwen3.5-plus',
        displayName: 'Qwen 3.5 Plus',
        provider: this.name,
        contextWindow: 256000,
        maxOutputTokens: 65536,
        supportsVision: true,
        supportsFunctionCall: true,
        supportsStreaming: true,
        knowledgeCutoff: '2026-01',
        pricing: {
          inputPerMillion: 0.002,
          outputPerMillion: 0.006,
          cacheReadPerMillion: 0.0002,
        },
        capabilities: {
          codeGeneration: true,
          codeAnalysis: true,
          mathematicalReasoning: true,
          multilingual: true,
          longContext: true,
        },
      },
      {
        id: 'qwen-plus',
        displayName: 'Qwen Plus',
        provider: this.name,
        contextWindow: 131072,
        maxOutputTokens: 32768,
        supportsVision: false,
        supportsFunctionCall: true,
        supportsStreaming: true,
        pricing: {
          inputPerMillion: 0.0005,
          outputPerMillion: 0.002,
        },
        capabilities: {
          codeGeneration: true,
          multilingual: true,
        },
      },
      {
        id: 'qwen-max',
        displayName: 'Qwen Max',
        provider: this.name,
        contextWindow: 32768,
        maxOutputTokens: 8192,
        supportsVision: false,
        supportsFunctionCall: true,
        supportsStreaming: true,
        pricing: {
          inputPerMillion: 0.004,
          outputPerMillion: 0.012,
        },
        capabilities: {
          codeGeneration: true,
          mathematicalReasoning: true,
        },
      },
    ];

    models.forEach(model => {
      this.modelCache.set(model.id, model);
    });
    this.lastCacheUpdate = Date.now();

    return models;
  }

  async validateModel(model: string): Promise<boolean> {
    try {
      const models = await this.listModels();
      return models.some(m => m.id === model);
    } catch {
      return false;
    }
  }

  async *chat(
    messages: Message[],
    options: ChatOptions
  ): AsyncIterable<ChatChunk> {
    const normalizedMessages = this.normalizeMessages(messages);
    
    const payload = {
      model: options.model || this.defaultModel,
      messages: normalizedMessages,
      stream: true,
      max_tokens: options.maxTokens,
      temperature: options.temperature,
      top_p: options.topP,
      stop: options.stopSequences,
      ...(options.tools && {
        tools: options.tools.map(tool => ({
          type: 'function' as const,
          function: {
            name: tool.name,
            description: tool.description,
            parameters: tool.inputSchema,
          },
        })),
      }),
      ...(options.toolChoice && {
        tool_choice: this.normalizeToolChoice(options.toolChoice),
      }),
    };

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Aliyun API error (${response.status}): ${error}`);
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let accumulatedUsage: TokenUsage = {
        inputTokens: 0,
        outputTokens: 0,
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed === 'data: [DONE]') continue;

          if (trimmed.startsWith('data: ')) {
            try {
              const data = JSON.parse(trimmed.slice(6));
              const chunk = this.parseChunk(data);
              
              if (chunk.usage) {
                accumulatedUsage = chunk.usage;
              }
              
              yield chunk;
            } catch (error) {
              console.warn('Failed to parse SSE data:', error);
            }
          }
        }
      }

      // 发送最终的使用量统计
      if (accumulatedUsage.totalTokens || accumulatedUsage.inputTokens) {
        yield {
          type: 'done',
          usage: accumulatedUsage,
          finishReason: 'stop',
        };
      }
    } catch (error) {
      yield {
        type: 'error',
        error: error instanceof Error ? error : new Error(String(error)),
      };
    }
  }

  private parseChunk(data: Record<string, unknown>): ChatChunk {
    const choices = data.choices as Array<{
      delta?: {
        content?: string;
        role?: string;
        tool_calls?: Array<{
          id: string;
          type: string;
          function: {
            name: string;
            arguments: string;
          };
        }>;
      };
      finish_reason?: string;
    }>;

    if (!choices || choices.length === 0) {
      return { type: 'content', content: '' };
    }

    const choice = choices[0];
    const delta = choice.delta;

    if (delta?.tool_calls && delta.tool_calls.length > 0) {
      const toolCall = delta.tool_calls[0];
      return {
        type: 'tool_use',
        toolUseId: toolCall.id,
        toolName: toolCall.function.name,
        toolInput: JSON.parse(toolCall.function.arguments),
      };
    }

    const content = delta?.content || '';
    
    const usage = data.usage as {
      prompt_tokens?: number;
      completion_tokens?: number;
      total_tokens?: number;
    };

    return {
      type: 'content',
      content,
      usage: usage ? {
        inputTokens: usage.prompt_tokens || 0,
        outputTokens: usage.completion_tokens || 0,
        totalTokens: usage.total_tokens || 0,
      } : undefined,
      finishReason: choice.finish_reason as ChatChunk['finishReason'],
    };
  }

  private normalizeToolChoice(toolChoice: ChatOptions['toolChoice']): unknown {
    if (typeof toolChoice === 'string') {
      if (toolChoice === 'auto') return 'auto';
      if (toolChoice === 'required') return 'required';
      if (toolChoice === 'none') return 'none';
    }
    
    if (typeof toolChoice === 'object' && toolChoice.type === 'tool') {
      return {
        type: 'function',
        function: { name: toolChoice.name },
      };
    }
    
    return 'auto';
  }

  getCost(model: string, usage: TokenUsage): CostInfo {
    const modelInfo = this.modelCache.get(model);
    if (!modelInfo?.pricing) {
      return {
        currency: 'USD',
        inputCost: 0,
        outputCost: 0,
        totalCost: 0,
      };
    }

    return this.calculateCost(usage, modelInfo.pricing);
  }
}

// 注册 Provider
ProviderRegistry.getInstance().register('aliyun', AliyunProvider);
