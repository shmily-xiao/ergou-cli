/**
 * OpenAI Provider 实现
 * 支持 GPT 系列模型
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

export class OpenAIProvider extends BaseModelProvider {
  private static readonly DEFAULT_BASE_URL = 'https://api.openai.com/v1';
  
  private apiKey: string;
  private baseUrl: string;

  constructor(config: ProviderConfig) {
    super('openai', 'gpt-4o', config);
    
    this.apiKey = config.apiKey || process.env.OPENAI_API_KEY || '';
    this.baseUrl = config.baseUrl || OpenAIProvider.DEFAULT_BASE_URL;
    
    if (!this.apiKey) {
      throw new Error(
        'OpenAI API key is required. Set OPENAI_API_KEY environment variable or provide apiKey in config.'
      );
    }
  }

  async listModels(): Promise<ModelInfo[]> {
    const models: ModelInfo[] = [
      {
        id: 'gpt-4o',
        displayName: 'GPT-4o',
        provider: this.name,
        contextWindow: 128000,
        maxOutputTokens: 16384,
        supportsVision: true,
        supportsFunctionCall: true,
        supportsStreaming: true,
        knowledgeCutoff: '2024-07',
        pricing: {
          inputPerMillion: 0.005,
          outputPerMillion: 0.015,
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
        id: 'gpt-4o-mini',
        displayName: 'GPT-4o Mini',
        provider: this.name,
        contextWindow: 128000,
        maxOutputTokens: 16384,
        supportsVision: true,
        supportsFunctionCall: true,
        supportsStreaming: true,
        pricing: {
          inputPerMillion: 0.00015,
          outputPerMillion: 0.0006,
        },
        capabilities: {
          codeGeneration: true,
          multilingual: true,
        },
      },
      {
        id: 'gpt-4-turbo',
        displayName: 'GPT-4 Turbo',
        provider: this.name,
        contextWindow: 128000,
        maxOutputTokens: 4096,
        supportsVision: true,
        supportsFunctionCall: true,
        supportsStreaming: true,
        pricing: {
          inputPerMillion: 0.01,
          outputPerMillion: 0.03,
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
        throw new Error(`OpenAI API error (${response.status}): ${error}`);
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
ProviderRegistry.getInstance().register('openai', OpenAIProvider);
