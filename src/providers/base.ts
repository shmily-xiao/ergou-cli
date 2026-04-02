/**
 * Model Provider 抽象基类
 * 所有 Provider 实现都需要继承这个基类
 */

import type {
  ModelProvider,
  ModelInfo,
  Message,
  ChatOptions,
  ChatChunk,
  TokenUsage,
  CostInfo,
  ModelPricing,
  ProviderConfig,
} from '@/types';

export abstract class BaseModelProvider implements ModelProvider {
  readonly name: string;
  readonly defaultModel: string;
  protected config: ProviderConfig;
  protected modelCache: Map<string, ModelInfo> = new Map();
  protected lastCacheUpdate: number = 0;
  protected readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor(name: string, defaultModel: string, config: ProviderConfig) {
    this.name = name;
    this.defaultModel = defaultModel;
    this.config = config;
  }

  abstract listModels(): Promise<ModelInfo[]>;
  
  abstract chat(
    messages: Message[], 
    options: ChatOptions
  ): AsyncIterable<ChatChunk>;

  abstract validateModel(model: string): Promise<boolean>;

  abstract getCost(model: string, usage: TokenUsage): CostInfo;

  /**
   * 获取模型信息（带缓存）
   */
  async getModelInfo(modelId: string): Promise<ModelInfo | null> {
    const cached = this.modelCache.get(modelId);
    if (cached && Date.now() - this.lastCacheUpdate < this.CACHE_TTL) {
      return cached;
    }

    try {
      const models = await this.listModels();
      const model = models.find(m => m.id === modelId) || null;
      
      if (model) {
        this.modelCache.set(modelId, model);
        this.lastCacheUpdate = Date.now();
      }
      
      return model;
    } catch (error) {
      console.error(`[${this.name}] Failed to fetch model info:`, error);
      return cached || null;
    }
  }

  /**
   * 计算成本（通用实现）
   */
  protected calculateCost(usage: TokenUsage, pricing: ModelPricing): CostInfo {
    const inputCost = (usage.inputTokens / 1_000_000) * pricing.inputPerMillion;
    const outputCost = (usage.outputTokens / 1_000_000) * pricing.outputPerMillion;
    
    let cacheReadCost = 0;
    let cacheWriteCost = 0;
    
    if (usage.cacheReadTokens && pricing.cacheReadPerMillion) {
      cacheReadCost = (usage.cacheReadTokens / 1_000_000) * pricing.cacheReadPerMillion;
    }
    
    if (usage.cacheWriteTokens && pricing.cacheWritePerMillion) {
      cacheWriteCost = (usage.cacheWriteTokens / 1_000_000) * pricing.cacheWritePerMillion;
    }

    return {
      currency: 'USD',
      inputCost,
      outputCost,
      totalCost: inputCost + outputCost + cacheReadCost + cacheWriteCost,
    };
  }

  /**
   * 合并消息（处理多模态内容）
   */
  protected normalizeMessages(messages: Message[]): Message[] {
    return messages.map(msg => ({
      ...msg,
      content: this.normalizeContent(msg.content),
    }));
  }

  protected normalizeContent(
    content: string | unknown[]
  ): string | unknown[] {
    if (typeof content === 'string') {
      return content;
    }
    
    if (Array.isArray(content)) {
      return content.map(block => {
        if (typeof block === 'string') {
          return { type: 'text', text: block };
        }
        return block;
      });
    }
    
    return content;
  }

  /**
   * 错误重试包装器
   */
  protected async withRetry<T>(
    fn: () => Promise<T>,
    maxRetries = 3,
    baseDelay = 1000
  ): Promise<T> {
    let lastError: unknown;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        
        if (attempt === maxRetries) {
          break;
        }
        
        const delay = baseDelay * Math.pow(2, attempt - 1);
        console.warn(
          `[${this.name}] Request failed (attempt ${attempt}/${maxRetries}), retrying in ${delay}ms...`
        );
        
        await this.sleep(delay);
      }
    }
    
    throw lastError;
  }

  protected sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async dispose?(): Promise<void> {
    this.modelCache.clear();
  }
}

/**
 * Provider 注册表
 */
export class ProviderRegistry {
  private static instance: ProviderRegistry;
  private providers: Map<string, new (config: ProviderConfig) => BaseModelProvider> = new Map();

  private constructor() {}

  static getInstance(): ProviderRegistry {
    if (!ProviderRegistry.instance) {
      ProviderRegistry.instance = new ProviderRegistry();
    }
    return ProviderRegistry.instance;
  }

  register(
    name: string,
    providerClass: new (config: ProviderConfig) => BaseModelProvider
  ): void {
    this.providers.set(name, providerClass);
  }

  getProvider(name: string): (new (config: ProviderConfig) => BaseModelProvider) | undefined {
    return this.providers.get(name);
  }

  listProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  async createProvider(name: string, config: ProviderConfig): Promise<BaseModelProvider> {
    const ProviderClass = this.providers.get(name);
    if (!ProviderClass) {
      throw new Error(`Provider '${name}' not found. Available: ${this.listProviders().join(', ')}`);
    }
    return new ProviderClass(config);
  }
}
