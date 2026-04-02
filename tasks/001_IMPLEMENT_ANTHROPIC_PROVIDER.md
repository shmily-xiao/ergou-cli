# 任务 001: 实现 Anthropic Provider

## 🎯 任务描述

实现 Anthropic Provider，支持 Claude 系列模型。

## 📋 技术要求

### 创建文件
`src/providers/anthropic.ts`

### 继承基类
继承 `BaseModelProvider`

### 使用 SDK
`@anthropic-ai/sdk`

### 支持的模型
- `claude-sonnet-4-6` - 日常使用
- `claude-opus-4-6` - 复杂任务
- `claude-haiku-4-5` - 快速响应

### 实现方法
```typescript
class AnthropicProvider extends BaseModelProvider {
  async listModels(): Promise<ModelInfo[]>
  async *chat(messages: Message[], options: ChatOptions): AsyncIterable<ChatChunk>
  async validateModel(model: string): Promise<boolean>
  getCost(model: string, usage: TokenUsage): CostInfo
}
```

### 注册 Provider
```typescript
ProviderRegistry.getInstance().register('anthropic', AnthropicProvider);
```

## 📚 参考文件
- `src/providers/aliyun.ts` - 参考实现
- `src/providers/base.ts` - 基类定义
- `src/types/index.ts` - 类型定义

## ✅ 验收标准
- [ ] 实现所有必需方法
- [ ] 支持流式聊天
- [ ] 添加到 ProviderRegistry
- [ ] 类型安全
- [ ] 错误处理完善
- [ ] 代码风格符合规范

## 💰 模型定价
| 模型 | 输入 | 输出 | 上下文 |
|------|------|------|--------|
| claude-sonnet-4-6 | $3/1M | $15/1M | 200K |
| claude-opus-4-6 | $15/1M | $75/1M | 200K |
| claude-haiku-4-5 | $1/1M | $5/1M | 200K |

---

_执行 Agent: ai-engineer_
_使用模型：qwen3-coder-plus_
_优先级：🔴 P0_
