/**
 * Zhipu GLM Provider
 * 智谱 AI GLM 系列模型支持
 */

import { fetch } from 'undici';
import { BaseModelProvider, ProviderRegistry } from './base.js';
import type {
  ModelInfo,
  ModelPricing,
  Message,
  ChatOptions,
  ChatChunk,
  TokenUsage,
  CostInfo,
  ProviderConfig,
} from '@/types';

export class ZhipuProvider extends BaseModelProvider {
  private static readonly DEFAULT_BASE_URL = 'https://open.bigmodel.cn/api/paas/v4';
  
  private static readonly MODELS: ModelInfo[] = [
    {
      id: 'glm-5',
      displayName: 'GLM-5',
      provider: 'zhipu',
      contextWindow: 128000,
      maxOutputTokens: 32768,
      supportsVision: true,
      supportsFunctionCall: true,
      supportsStreaming: true,
      pricing: {
        inputPerMillion: 0.005,
        outputPerMillion: 0.02,
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
      id: 'glm-4',
      displayName: 'GLM-4',
      provider: 'zhipu',
      contextWindow: 128000,
      maxOutputTokens: 32768,
      supportsVision: true,
      supportsFunctionCall: true,
      supportsStreaming: true,
      pricing: {
        inputPerMillion: 0.005,
        outputPerMillion: 0.02,
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
      id: 'glm-4-flash',
      displayName: 'GLM-4 Flash',
      provider: 'zhipu',
      contextWindow: 128000,
      maxOutputTokens: 16384,
      supportsVision: false,
      supportsFunctionCall: true,
      supportsStreaming: true,
      pricing: {
        inputPerMillion: 0.001,
        outputPerMillion: 0.004,
      },
      capabilities: {
        codeGeneration: true,
        codeAnalysis: true,
        mathematicalReasoning: true,
        multilingual: true,
      },
    },
  ];

  constructor(config: ProviderConfig) {
    super('zhipu', 'glm-5', config);
  }

  async listModels(): Promise<ModelInfo[]> {
    return ZhipuProvider.MODELS;
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
        throw new Error(`Zhipu API error (${response.status}): ${error}`);
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let usage: TokenUsage | undefined;

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
              
              if (data.choices && data.choices.length > 0) {
                const choice = data.choices[0];
                
                if (choice.delta?.content) {
                  yield {
                    type: 'content',
                    content: choice.delta.content,
                  };
                }
                
                if (choice.delta?.tool_calls) {
                  for (const toolCall of choice.delta.tool_calls) {
                    yield {
                      type: 'tool_use',
                      toolUseId: toolCall.id,
                      toolName: toolCall.function?.name,
                      toolInput: toolCall.function?.arguments ? JSON.parse(toolCall.function.arguments) : {},
                    };
                  }
                }
                
                if (choice.finish_reason) {
                  if (data.usage) {
                    usage = {
                      inputTokens: data.usage.prompt_tokens || 0,
                      outputTokens: data.usage.completion_tokens || 0,
                      totalTokens: data.usage.total_tokens || 0,
                    };
                  }
                  
                  yield {
                    type: 'done',
                    usage,
                    finishReason: choice.finish_reason as any,
                  };
                }
              }
            } catch (e) {
              // Ignore parse errors
            }
          }
        }
      }
    } catch (error) {
      yield {
        type: 'error',
        error: error instanceof Error ? error : new Error(String(error)),
      };
    }
  }

  async validateModel(model: string): Promise<boolean> {
    const models = await this.listModels();
    return models.some(m => m.id === model);
  }

  getCost(model: string, usage: TokenUsage): CostInfo {
    const modelInfo = ZhipuProvider.MODELS.find(m => m.id === model);
    const pricing = modelInfo?.pricing || { inputPerMillion: 0.005, outputPerMillion: 0.02 };
    
    return this.calculateCost(usage, pricing);
  }

  protected get baseUrl(): string {
    return this.config.baseUrl || ZhipuProvider.DEFAULT_BASE_URL;
  }

  protected get apiKey(): string {
    return this.config.apiKey || process.env.ZHIPU_API_KEY || '';
  }
}

// 注册 Provider
ProviderRegistry.getInstance().register('zhipu', ZhipuProvider);
