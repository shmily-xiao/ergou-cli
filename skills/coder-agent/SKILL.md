---
name: ergou-coder-agent
description: Ergou 专业代码 Agent - 基于 Qwen3-Coder-Plus 模型，提供专业的代码生成、重构、调试能力
version: 1.0.0
author: shmily
license: MIT
tags: [coding, ai-agent, qwen3-coder-plus, ergou-cli]
model: qwen3-coder-plus
provider: aliyun
---

# Ergou Coder Agent - 专业代码 Agent

## 📦 Agent 概述

**Ergou Coder Agent** 是基于阿里云 **Qwen3-Coder-Plus** 模型的专业代码 Agent，提供：

- ✅ 代码生成（支持多种编程语言）
- ✅ 代码重构和优化
- ✅ Bug 调试和修复
- ✅ 单元测试编写
- ✅ 代码审查和建议
- ✅ 技术文档编写

## 🎯 核心能力

### 1. 代码生成
- Web 前端（React/Vue/Angular/HTML/CSS）
- 后端服务（Node.js/Python/Go/Java）
- 移动应用（React Native/Flutter）
- 数据库设计（SQL/NoSQL）
- API 设计（REST/GraphQL）

### 2. 代码重构
- 代码结构优化
- 性能优化
- 可读性改进
- 设计模式应用
- 技术债务清理

### 3. 调试修复
- Bug 定位和分析
- 错误修复方案
- 边界条件处理
- 异常处理完善

### 4. 测试编写
- 单元测试（Jest/Vitest/Pytest）
- 集成测试
- E2E 测试
- 测试覆盖率提升

### 5. 代码审查
- 代码质量评估
- 最佳实践建议
- 安全隐患检测
- 性能瓶颈分析

## 🚀 使用方式

### 方式 1: 命令行使用

```bash
# 使用 ergou-cli
ergou --agent coder "写一个快速排序算法"

# 指定模型
ergou --model qwen3-coder-plus "创建一个 React 登录组件"

# 交互模式
ergou --agent coder
> 帮我重构这个函数，提高可读性
```

### 方式 2: OpenClaw Skill

```bash
# 使用 Skill
/openclaw skill use ergou-coder-agent "帮我写一个 Express REST API"

# 带参数
/openclaw skill use ergou-coder-agent --language typescript --framework express "创建用户管理 API"
```

### 方式 3: API 调用

```typescript
import { CoderAgent } from '@ergou/cli';

const agent = new CoderAgent({
  model: 'qwen3-coder-plus',
  provider: 'aliyun',
  temperature: 0.1,
  maxTokens: 8192,
});

const result = await agent.code({
  task: 'Create a login form',
  language: 'typescript',
  framework: 'react',
});

console.log(result.code);
```

## 📋 任务模板

### 代码生成任务

```markdown
# 代码生成请求

## 任务描述
[详细描述需要生成的代码功能]

## 技术要求
- 语言：[TypeScript/Python/Go/etc.]
- 框架：[React/Express/FastAPI/etc.]
- 风格：[函数式/面向对象]
- 特殊要求：[类型安全/性能优化/etc.]

## 输入示例
[如果有输入，提供示例]

## 预期输出
[期望的代码结构和功能]
```

### 代码重构任务

```markdown
# 代码重构请求

## 原始代码
[粘贴需要重构的代码]

## 重构目标
- [ ] 提高可读性
- [ ] 优化性能
- [ ] 减少重复
- [ ] 改进结构
- [ ] 其他：[具体目标]

## 约束条件
[不能改变的功能/接口等]
```

### Bug 调试任务

```markdown
# Bug 调试请求

## 问题描述
[详细描述遇到的问题]

## 错误信息
[错误日志/堆栈跟踪]

## 相关代码
[相关代码片段]

## 已尝试的方案
[已经尝试过的解决方法]

## 预期行为
[代码应该的行为]

## 实际行为
[代码实际的行为]
```

## 🎭 Agent 人格

### 专业特质
- **严谨** - 代码准确，考虑周全
- **高效** - 快速响应，直接给出解决方案
- **专业** - 遵循最佳实践和设计模式
- **耐心** - 详细解释，提供多种方案
- **务实** - 考虑实际应用场景和约束

### 沟通风格
```
用户：帮我写个排序算法

Coder Agent:
好的，我来为你实现一个快速排序算法。

## 实现方案

我将使用 TypeScript 实现，包含以下特点：
1. 泛型支持，可排序任意类型
2. 原地排序，空间复杂度 O(log n)
3. 包含详细注释

## 代码实现

[代码...]

## 使用示例

[示例...]

## 复杂度分析
- 时间：平均 O(n log n)，最坏 O(n²)
- 空间：O(log n)

需要我实现其他排序算法或添加更多功能吗？
```

## ⚙️ 配置选项

### 环境变量

```bash
# 设置默认模型
ERGOU_CODER_MODEL=qwen3-coder-plus

# 设置 Provider
ERGOU_CODER_PROVIDER=aliyun

# 设置温度参数 (0.0-1.0)
ERGOU_CODER_TEMPERATURE=0.1

# 设置最大 Token
ERGOU_CODER_MAX_TOKENS=8192

# API Key
export DASHSCOPE_API_KEY=your-api-key
```

### 配置文件

`~/.ergou/config.json`:

```json
{
  "agents": {
    "coder": {
      "model": "qwen3-coder-plus",
      "provider": "aliyun",
      "temperature": 0.1,
      "maxTokens": 8192,
      "tools": [
        "file_read",
        "file_write",
        "bash",
        "grep",
        "git"
      ]
    }
  }
}
```

## 🛠️ 工具集成

### 可用工具

| 工具 | 用途 | 权限 |
|------|------|------|
| `file_read` | 读取文件内容 | 只读 |
| `file_write` | 写入/修改文件 | 需要确认 |
| `bash` | 执行命令 | 需要确认 |
| `grep` | 代码搜索 | 只读 |
| `glob` | 文件匹配 | 只读 |
| `git` | Git 操作 | 需要确认 |

### 工具使用示例

```typescript
// 读取文件后重构
const code = await tools.file_read('src/utils.ts');
const refactored = await agent.refactor(code, { goal: 'improve readability' });
await tools.file_write('src/utils.ts', refactored);

// 运行测试
await tools.bash('npm test');
```

## 📊 性能指标

### 基准测试

| 任务类型 | Qwen3-Coder-Plus | Claude-Sonnet-4-6 | GPT-4o |
|---------|------------------|-------------------|--------|
| **HumanEval** | 85.2% | 83.1% | 82.5% |
| **MBPP** | 82.5% | 80.2% | 79.8% |
| **代码生成速度** | 45 tokens/s | 38 tokens/s | 42 tokens/s |
| **上下文窗口** | 256K | 200K | 128K |
| **成本/1M tokens** | $0.002/$0.006 | $0.003/$0.015 | $0.005/$0.015 |

### 响应时间

- 简单任务（<100 行代码）：< 5 秒
- 中等任务（100-500 行）：10-30 秒
- 复杂任务（>500 行）：30-60 秒

## 🎯 最佳实践

### 1. 提供清晰的上下文

```bash
# ❌ 模糊
"帮我写个 API"

# ✅ 清晰
"帮我创建一个用户管理的 REST API，使用 Express + TypeScript，需要包含：
- GET /users - 获取用户列表
- POST /users - 创建用户
- GET /users/:id - 获取单个用户
- PUT /users/:id - 更新用户
- DELETE /users/:id - 删除用户
使用 MongoDB，包含输入验证和错误处理"
```

### 2. 分步迭代

```bash
# 第一步：生成基础代码
ergou "创建 React 登录组件基础结构"

# 第二步：添加功能
ergou "添加表单验证和错误处理"

# 第三步：优化样式
ergou "使用 Tailwind CSS 美化界面"

# 第四步：编写测试
ergou "为登录组件编写单元测试"
```

### 3. 代码审查

```bash
# 请求审查
ergou "审查这段代码，找出潜在问题" [粘贴代码]

# 请求优化
ergou "优化这段代码的性能" [粘贴代码]

# 请求解释
ergou "解释这段代码的工作原理" [粘贴代码]
```

## 🔐 安全考虑

### 代码安全
- ✅ 不生成恶意代码
- ✅ 不包含硬编码密钥
- ✅ 遵循安全最佳实践
- ✅ 输入验证和转义

### 权限控制
- ⚠️ 文件修改需要确认
- ⚠️ 命令执行需要确认
- ⚠️ 敏感操作需要二次确认

## 📝 示例任务

### 示例 1: 创建 React 组件

```bash
ergou --agent coder "创建一个 React 登录表单组件，要求：
- 使用 TypeScript
- 使用 React Hooks
- 包含邮箱和密码验证
- 使用 Tailwind CSS 样式
- 包含加载状态和错误处理
- 导出类型定义"
```

### 示例 2: 重构代码

```bash
ergou --agent coder "重构这个函数：
[粘贴代码]

目标：
1. 提高可读性
2. 减少嵌套
3. 添加类型注解
4. 改进错误处理"
```

### 示例 3: 编写测试

```bash
ergou --agent coder "为这个函数编写单元测试：
[粘贴代码]

要求：
- 使用 Jest
- 覆盖所有边界条件
- 包含错误情况测试
- 目标覆盖率 90%+"
```

## 🆘 故障排除

### 常见问题

**Q: 生成的代码有语法错误？**
A: 提供反馈让 Agent 修复，或指定更具体的技术要求

**Q: 代码不符合项目风格？**
A: 提供项目的代码规范或示例代码

**Q: 性能不理想？**
A: 明确要求性能优化，或指定性能指标

**Q: 需要特定库或框架？**
A: 在任务描述中明确指定技术栈和版本

## 📞 支持和反馈

- 📧 Email: support@ergou.cli
- 💬 Discord: 加入社区
- 🐛 Issues: https://github.com/shmily/ergou-cli/issues

## 📄 许可证

MIT License

---

_版本：1.0.0_
_模型：Qwen3-Coder-Plus_
_Provider: 阿里云 DashScope_
_最后更新：2026-04-02_
