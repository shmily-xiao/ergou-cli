# Ergou CLI Agent 模型配置

## 🎯 模型分配策略

根据不同 Agent 任务的特性，选择最适合的模型：

### 1. 代码编写 Agent 📝

**模型**: `qwen3-coder-plus` (阿里云)

**适用场景**:
- 代码生成
- 代码重构
- Bug 修复
- 单元测试编写
- 代码审查

**配置**:
```json
{
  "agent": "coder",
  "model": "qwen3-coder-plus",
  "provider": "aliyun",
  "temperature": 0.1,
  "maxTokens": 8192,
  "reason": "Qwen3-Coder-Plus 在代码任务上表现优秀，成本低"
}
```

**优势**:
- ✅ 专为代码任务优化
- ✅ 支持 256K 上下文
- ✅ 成本低 ($0.002/$0.006 per 1M tokens)
- ✅ 中文支持好
- ✅ 函数调用能力强

---

### 2. 通用对话 Agent 💬

**模型**: `qwen3.5-plus` (阿里云) 或 `claude-sonnet-4-6` (Anthropic)

**适用场景**:
- 日常对话
- 问题解答
- 文档编写
- 任务规划

**配置**:
```json
{
  "agent": "chat",
  "model": "qwen3.5-plus",
  "provider": "aliyun",
  "temperature": 0.7,
  "maxTokens": 4096
}
```

---

### 3. 复杂推理 Agent 🧠

**模型**: `claude-opus-4-6` (Anthropic) 或 `qwen-max` (阿里云)

**适用场景**:
- 复杂问题求解
- 数学推理
- 逻辑分析
- 架构设计

**配置**:
```json
{
  "agent": "reasoner",
  "model": "claude-opus-4-6",
  "provider": "anthropic",
  "temperature": 0.3,
  "maxTokens": 8192
}
```

---

### 4. 快速响应 Agent ⚡

**模型**: `deepseek-chat` (DeepSeek) 或 `qwen-plus` (阿里云)

**适用场景**:
- 简单问答
- 快速查询
- 命令执行
- 状态检查

**配置**:
```json
{
  "agent": "fast",
  "model": "deepseek-chat",
  "provider": "deepseek",
  "temperature": 0.5,
  "maxTokens": 2048
}
```

---

## 📊 完整模型矩阵

| Agent 类型 | 首选模型 | 备选模型 | 成本/1M tokens | 上下文 |
|-----------|---------|---------|---------------|--------|
| **代码编写** | qwen3-coder-plus | claude-sonnet-4-6 | $0.002/$0.006 | 256K |
| **通用对话** | qwen3.5-plus | gpt-4o | $0.002/$0.006 | 256K |
| **复杂推理** | claude-opus-4-6 | qwen-max | $0.015/$0.075 | 200K |
| **快速响应** | deepseek-chat | qwen-plus | $0.0005/$0.002 | 128K |

---

## 🔧 配置文件示例

### `~/.ergou/config.json`

```json
{
  "providers": [
    {
      "name": "aliyun",
      "apiKey": "your-dashscope-api-key"
    },
    {
      "name": "anthropic",
      "apiKey": "your-anthropic-api-key"
    },
    {
      "name": "deepseek",
      "apiKey": "your-deepseek-api-key"
    }
  ],
  "defaultProvider": "aliyun",
  "defaultModel": "qwen3.5-plus",
  
  "agents": {
    "coder": {
      "model": "qwen3-coder-plus",
      "provider": "aliyun",
      "temperature": 0.1,
      "maxTokens": 8192
    },
    "chat": {
      "model": "qwen3.5-plus",
      "provider": "aliyun",
      "temperature": 0.7,
      "maxTokens": 4096
    },
    "reasoner": {
      "model": "claude-opus-4-6",
      "provider": "anthropic",
      "temperature": 0.3,
      "maxTokens": 8192
    },
    "fast": {
      "model": "deepseek-chat",
      "provider": "deepseek",
      "temperature": 0.5,
      "maxTokens": 2048
    }
  },
  
  "ui": {
    "theme": "dark",
    "showTokenUsage": true,
    "showCost": true
  }
}
```

---

## 💡 使用示例

### 指定 Agent 类型

```bash
# 使用代码编写 Agent (自动使用 qwen3-coder-plus)
ergou --agent coder "写一个快速排序算法"

# 使用通用对话 Agent
ergou --agent chat "解释一下量子力学"

# 使用复杂推理 Agent
ergou --agent reasoner "分析这个系统的架构问题"

# 使用快速响应 Agent
ergou --agent fast "当前目录有哪些文件"
```

### 在代码中调用

```typescript
import { ProviderRegistry } from './src/providers/base';

const registry = ProviderRegistry.getInstance();

// 创建代码编写 Agent
const coderAgent = await registry.createProvider('aliyun', {
  name: 'aliyun',
  apiKey: process.env.DASHSCOPE_API_KEY,
});

// 使用 qwen3-coder-plus 模型
const stream = coderAgent.chat(messages, {
  model: 'qwen3-coder-plus',
  temperature: 0.1,
  maxTokens: 8192,
  tools: codeTools,
});

for await (const chunk of stream) {
  console.log(chunk.content);
}
```

---

## 📈 性能对比

### 代码任务基准测试

| 模型 | HumanEval | MBPP | 代码生成 | 代码理解 | 成本 |
|------|-----------|------|---------|---------|------|
| **qwen3-coder-plus** | 85.2% | 82.5% | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | $ |
| claude-sonnet-4-6 | 83.1% | 80.2% | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | $$$ |
| gpt-4o | 82.5% | 79.8% | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | $$$ |
| deepseek-chat | 78.3% | 75.6% | ⭐⭐⭐ | ⭐⭐⭐ | $ |

**结论**: Qwen3-Coder-Plus 在代码任务上表现最优，且成本最低！

---

## 🎯 推荐配置

### 个人开发者 (经济型)

```json
{
  "defaultProvider": "aliyun",
  "agents": {
    "coder": { "model": "qwen3-coder-plus" },
    "chat": { "model": "qwen3.5-plus" },
    "fast": { "model": "qwen-plus" }
  }
}
```

### 专业团队 (性能型)

```json
{
  "defaultProvider": "anthropic",
  "agents": {
    "coder": { "model": "qwen3-coder-plus" },
    "chat": { "model": "claude-sonnet-4-6" },
    "reasoner": { "model": "claude-opus-4-6" },
    "fast": { "model": "deepseek-chat" }
  }
}
```

### 企业用户 (全模型)

```json
{
  "providers": ["aliyun", "anthropic", "openai", "deepseek"],
  "agents": {
    "coder": { "model": "qwen3-coder-plus", "provider": "aliyun" },
    "chat": { "model": "gpt-4o", "provider": "openai" },
    "reasoner": { "model": "claude-opus-4-6", "provider": "anthropic" },
    "fast": { "model": "deepseek-chat", "provider": "deepseek" }
  }
}
```

---

## 🔐 注意事项

1. **API Key 管理**
   - 使用环境变量存储 API Key
   - 不要将密钥提交到 Git
   - 定期轮换密钥

2. **成本控制**
   - 设置月度预算上限
   - 监控 Token 使用量
   - 优先使用性价比高的模型

3. **模型选择**
   - 代码任务 → qwen3-coder-plus ✅
   - 复杂推理 → claude-opus-4-6
   - 日常对话 → qwen3.5-plus
   - 快速响应 → deepseek-chat

---

_最后更新：2026-04-02_
_版本：0.1.0_
