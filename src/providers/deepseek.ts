/**
 * DeepSeek Provider 实现
 * 支持 DeepSeek 系列模型
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

export class DeepSeekProvider extends BaseModelProvider {
  private static readonly DEFAULT_BASE_URL = 'https://api.deepseek.com/v1';
  
  private apiKey: string;
  private baseUrl: string;

  constructor(config: ProviderConfig) {
    super('deepseek', 'deepseek-chat', config);
    
    this.apiKey = config.apiKey || process.env.DEEPSEEK_API_KEY || '';
    this.baseUrl = config.baseUrl || DeepSeekProvider.DEFAULT_BASE_URL;
    
    if (!this.apiKey) {
      throw new Error(
        'DeepSeek API key is required. Set DEEPSEEK_API_KEY environment variable or provide apiKey in config.'
      );
    }
  }

  async listModels(): Promise<ModelInfo[]> {
    const models: ModelInfo[] = [
      {
        id: 'deepseek-chat',
        displayName: 'DeepSeek Chat V3',
        provider: this.name,
        contextWindow: 128000,
        maxOutputTokens: 65536,
        supportsVision: false,
        supportsFunctionCall: true,
        supportsStreaming: true,
        knowledgeCutoff: '2024-07',
        pricing: {
          inputPerMillion: 0.00027, // ¥0.002/1K tokens
          outputPerMillion: 0.0011, // ¥0.008/1K tokens
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
        id: 'deepseek-coder',
        displayName: 'DeepSeek Coder',
        provider: this.name,
        contextWindow: 128000,
        maxOutputTokens: 65536,
        supportsVision: false,
        supportsFunctionCall: true,
        supportsStreaming: true,
        pricing: {
          inputPerMillion: 0.00027,
          outputPerMillion: 0.0011,
        },
        capabilities: {
          codeGeneration: true,
          codeAnalysis: true,
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
      max_tokens: options.maxTokens || 4096,
      stream: true,
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
        throw new Error(`DeepSeek API error (${response.status}): ${error}`);
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
ProviderRegistry.getInstance().register('deepseek', DeepSeekProvider);
