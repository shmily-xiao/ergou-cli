# 任务：实现 Anthropic Provider

## 🎯 任务描述

为 ergou-cli 项目实现 Anthropic Provider，支持 Claude 系列模型。

## 📋 技术要求

### 1. 创建文件
- `src/providers/anthropic.ts`

### 2. 继承基类
- 继承 `BaseModelProvider`
- 使用 `@anthropic-ai/sdk`

### 3. 支持的模型
- `claude-sonnet-4-6` - 日常使用推荐
- `claude-opus-4-6` - 复杂任务
- `claude-haiku-4-5` - 快速响应

### 4. 实现方法

```typescript
class AnthropicProvider extends BaseModelProvider {
  async listModels(): Promise<ModelInfo[]>
  async *chat(messages: Message[], options: ChatOptions): AsyncIterable<ChatChunk>
  async validateModel(model: string): Promise<boolean>
  getCost(model: string, usage: TokenUsage): CostInfo
}
```

### 5. 注册 Provider
```typescript
ProviderRegistry.getInstance().register('anthropic', AnthropicProvider);
```

## 📚 参考文件

- `src/providers/aliyun.ts` - 参考实现
- `src/providers/base.ts` - 基类定义
- `src/types/index.ts` - 类型定义

## ✅ 验收标准

- [ ] 实现 listModels() 方法
- [ ] 实现 chat() 方法（流式）
- [ ] 实现 validateModel() 方法
- [ ] 实现 getCost() 方法
- [ ] 添加到 ProviderRegistry
- [ ] 代码风格符合项目规范
- [ ] 类型定义完整
- [ ] 错误处理完善

## 🚀 使用方式

```typescript
import { ProviderRegistry } from './src/providers/base';

const registry = ProviderRegistry.getInstance();
const anthropic = await registry.createProvider('anthropic', {
  name: 'anthropic',
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const models = await anthropic.listModels();
console.log('Available models:', models);
```

## 📊 模型信息

| 模型 | 上下文 | 输入价格 | 输出价格 |
|------|--------|---------|---------|
| claude-sonnet-4-6 | 200K | $3/1M | $15/1M |
| claude-opus-4-6 | 200K | $15/1M | $75/1M |
| claude-haiku-4-5 | 200K | $1/1M | $5/1M |

---

_创建时间：2026-04-02_
_优先级：🔴 高_
_执行者：Coder Agent (qwen3-coder-plus)_
