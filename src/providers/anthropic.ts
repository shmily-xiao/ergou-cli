/**
 * Anthropic Provider 实现
 * 支持 Claude 系列模型
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

export class AnthropicProvider extends BaseModelProvider {
  private static readonly DEFAULT_BASE_URL = 'https://api.anthropic.com';
  
  private apiKey: string;
  private baseUrl: string;

  constructor(config: ProviderConfig) {
    super('anthropic', 'claude-sonnet-4-6', config);
    
    this.apiKey = config.apiKey || process.env.ANTHROPIC_API_KEY || '';
    this.baseUrl = config.baseUrl || AnthropicProvider.DEFAULT_BASE_URL;
    
    if (!this.apiKey) {
      throw new Error(
        'Anthropic API key is required. Set ANTHROPIC_API_KEY environment variable or provide apiKey in config.'
      );
    }
  }

  async listModels(): Promise<ModelInfo[]> {
    const models: ModelInfo[] = [
      {
        id: 'claude-sonnet-4-6',
        displayName: 'Claude Sonnet 4.6',
        provider: this.name,
        contextWindow: 200000,
        maxOutputTokens: 65536,
        supportsVision: true,
        supportsFunctionCall: true,
        supportsStreaming: true,
        knowledgeCutoff: '2026-01',
        pricing: {
          inputPerMillion: 3,
          outputPerMillion: 15,
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
        id: 'claude-opus-4-6',
        displayName: 'Claude Opus 4.6',
        provider: this.name,
        contextWindow: 200000,
        maxOutputTokens: 65536,
        supportsVision: true,
        supportsFunctionCall: true,
        supportsStreaming: true,
        pricing: {
          inputPerMillion: 15,
          outputPerMillion: 75,
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
        id: 'claude-haiku-4-5',
        displayName: 'Claude Haiku 4.5',
        provider: this.name,
        contextWindow: 200000,
        maxOutputTokens: 65536,
        supportsVision: false,
        supportsFunctionCall: true,
        supportsStreaming: true,
        pricing: {
          inputPerMillion: 1,
          outputPerMillion: 5,
        },
        capabilities: {
          codeGeneration: true,
          multilingual: true,
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
      ...(options.system && { system: options.system }),
      ...(options.temperature && { temperature: options.temperature }),
      ...(options.topP && { top_p: options.topP }),
      ...(options.tools && {
        tools: options.tools.map(tool => ({
          name: tool.name,
          description: tool.description,
          input_schema: tool.inputSchema,
        })),
      }),
    };

    try {
      const response = await fetch(`${this.baseUrl}/v1/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Anthropic API error (${response.status}): ${error}`);
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
          if (!trimmed || !trimmed.startsWith('data: ')) continue;
          if (trimmed === 'data: [DONE]') continue;

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
    const type = data.type as string;

    if (type === 'content_block_start') {
      const contentBlock = data.content_block as Record<string, unknown>;
      if (contentBlock.type === 'tool_use') {
        return {
          type: 'tool_use',
          toolUseId: contentBlock.id as string,
          toolName: contentBlock.name as string,
          toolInput: {},
        };
      }
    }

    if (type === 'content_block_delta') {
      const delta = data.delta as Record<string, unknown>;
      if (delta.type === 'text_delta') {
        return {
          type: 'content',
          content: delta.text as string,
        };
      }
      if (delta.type === 'input_json_delta') {
        return {
          type: 'tool_use',
          toolInput: JSON.parse(delta.partial_json as string),
        };
      }
    }

    if (type === 'message_delta') {
      const usage = data.usage as { input_tokens?: number; output_tokens?: number };
      return {
        type: 'content',
        content: '',
        usage: {
          inputTokens: usage?.input_tokens || 0,
          outputTokens: usage?.output_tokens || 0,
          totalTokens: (usage?.input_tokens || 0) + (usage?.output_tokens || 0),
        },
        finishReason: data.delta?.stop_reason as ChatChunk['finishReason'],
      };
    }

    return { type: 'content', content: '' };
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
ProviderRegistry.getInstance().register('anthropic', AnthropicProvider);
