# Ergou CLI 开发指南

## 📁 项目结构

```
ergou-cli/
├── src/
│   ├── types/           # 类型定义
│   │   └── index.ts     # 50+ 核心类型
│   ├── providers/       # 模型 Provider
│   │   ├── base.ts      # 抽象基类 + 注册表
│   │   ├── aliyun.ts    # 阿里云 Qwen ✅
│   │   ├── anthropic.ts # Anthropic Claude 🚧
│   │   ├── deepseek.ts  # DeepSeek 🚧
│   │   └── openai.ts    # OpenAI 兼容 🚧
│   ├── agent/           # Agent 核心
│   │   ├── planner.ts   # 任务规划 🚧
│   │   ├── context.ts   # 上下文管理 🚧
│   │   └── memory.ts    # 记忆系统 🚧
│   ├── tools/           # 工具系统
│   │   ├── bash.ts      # Shell 执行 🚧
│   │   ├── file-read.ts # 文件读取 🚧
│   │   └── file-write.ts# 文件写入 🚧
│   ├── cli/             # CLI 界面
│   │   ├── commands.ts  # 命令解析 🚧
│   │   └── ui.tsx       # Ink TUI 🚧
│   ├── utils/           # 工具函数
│   └── cli.ts           # 入口文件 🚧
├── tests/               # 测试文件
├── docs/                # 文档
├── package.json
├── tsconfig.json
└── tsup.config.ts
```

## 🛠️ 开发环境

### 前置要求

- Node.js >= 20.0.0
- Bun >= 1.3.5 (推荐)
- Git

### 安装依赖

```bash
cd ergou-cli
bun install
```

### 开发模式

```bash
# 运行开发版本
bun run dev

# 监听构建
bun run build:watch

# 类型检查
bun run typecheck

# 运行测试
bun run test
```

## 📝 实现新的 Provider

参考 `src/providers/aliyun.ts` 模板：

```typescript
import { BaseModelProvider, ProviderRegistry } from './base';

export class MyProvider extends BaseModelProvider {
  constructor(config: ProviderConfig) {
    super('myprovider', 'default-model', config);
    this.apiKey = config.apiKey || process.env.MY_API_KEY || '';
  }

  async listModels(): Promise<ModelInfo[]> {
    return [
      {
        id: 'model-1',
        displayName: 'Model 1',
        provider: this.name,
        contextWindow: 128000,
        // ... 其他字段
      },
    ];
  }

  async *chat(messages: Message[], options: ChatOptions): AsyncIterable<ChatChunk> {
    // 实现流式聊天
    const response = await fetch('...', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${this.apiKey}` },
      body: JSON.stringify(payload),
    });
    
    // 处理 SSE 流式响应
    // yield chunk
  }

  async validateModel(model: string): Promise<boolean> {
    const models = await this.listModels();
    return models.some(m => m.id === model);
  }

  getCost(model: string, usage: TokenUsage): CostInfo {
    // 计算成本
  }
}

// 注册 Provider
ProviderRegistry.getInstance().register('myprovider', MyProvider);
```

## 🛠️ 实现新的工具

```typescript
import type { Tool, ToolResult } from '@/types';

export class MyTool implements Tool {
  name = 'my_tool';
  description = '工具描述';
  inputSchema = {
    type: 'object',
    properties: {
      param1: { type: 'string', description: '参数 1' },
      param2: { type: 'number', description: '参数 2' },
    },
    required: ['param1'],
  };

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      // 工具实现
      const result = await doSomething(params.param1 as string);
      
      return {
        success: true,
        output: result,
        metadata: { duration: 100 },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
```

## 🧪 测试

```typescript
import { describe, it, expect } from 'vitest';
import { AliyunProvider } from '../src/providers/aliyun';

describe('AliyunProvider', () => {
  it('should list models', async () => {
    const provider = new AliyunProvider({
      name: 'aliyun',
      apiKey: 'test-key',
    });
    
    const models = await provider.listModels();
    expect(models.length).toBeGreaterThan(0);
  });
});
```

## 📤 提交代码

```bash
# 添加文件
git add .

# 提交（使用约定式提交）
git commit -m "feat: 实现 DeepSeek Provider"
git commit -m "fix: 修复文件读取错误处理"
git commit -m "docs: 更新 README"

# 推送
git push origin main
```

## 🎯 开发优先级

### Phase 1 (Week 1-2)
- [x] 项目骨架
- [x] 类型定义
- [x] Provider 抽象层
- [x] 阿里云 Provider ✅
- [ ] Anthropic Provider
- [ ] DeepSeek Provider
- [ ] CLI 入口

### Phase 2 (Week 3-4)
- [ ] 基础工具 (Bash, FileRead, FileWrite)
- [ ] 流式输出渲染
- [ ] Markdown 支持
- [ ] MVP 发布

## 🔧 常见问题

### Q: 如何调试 Provider？

```bash
# 启用详细日志
export ERGOU_DEBUG=1
bun run dev
```

### Q: 如何添加新的环境变量？

在 `src/providers/xxx.ts` 中：

```typescript
this.apiKey = config.apiKey || process.env.MY_API_KEY || '';
```

然后在 `.env` 文件中添加：

```
MY_API_KEY=your-key
```

### Q: 如何测试流式响应？

```typescript
for await (const chunk of provider.chat(messages, options)) {
  console.log('Chunk:', chunk);
}
```

## 📞 联系

- 项目仓库：https://github.com/shmily/ergou-cli
- 项目负责人：shmily

---

_最后更新：2026-04-02_
