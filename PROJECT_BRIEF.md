# Ergou CLI 项目简报

## 📋 项目信息

- **项目名称**: Ergou CLI
- **负责人**: shmily
- **位置**: `/Users/shmily/workspace/ergou-cli/`
- **GitHub**: https://github.com/shmily-xiao/ergou-cli
- **启动日期**: 2026-04-02

## 🎯 项目目标

创建通用的、开源的大模型终端 Agent 工具，支持多厂商大模型，具备完整的代码理解和生成能力。

## 🏗️ 技术架构

```
CLI Interface → Agent Core → Model Abstraction → Provider Adapters → Tool System
```

## 📦 已完成的工作

### Phase 1: 项目骨架 ✅
- [x] 项目目录和 Git 仓库
- [x] package.json 和依赖配置
- [x] TypeScript 配置
- [x] tsup 构建系统
- [x] 类型系统 (50+ 类型)
- [x] Provider 抽象层
- [x] Provider 注册表
- [x] 阿里云 Provider 实现
- [x] 文档系统 (16 个文档)

### Phase 2: 待完成 (委托给 Agent)
- [ ] Anthropic Provider 实现
- [ ] DeepSeek Provider 实现
- [ ] OpenAI Provider 实现
- [ ] Moonshot Provider 实现
- [ ] 智谱 Provider 实现
- [ ] CLI 入口实现
- [ ] 基础工具 (Bash, FileRead, FileWrite)
- [ ] Agent 核心 (任务规划、上下文管理)
- [ ] UI 渲染 (Ink TUI)
- [ ] 测试系统

## 🤖 Agent 使用策略

### 使用的 Skill
1. **agency-agents** - 委托代码任务给专业 Agent
2. **memorybridge** - 管理项目记忆和知识

### Agent 分配

| 任务类型 | 执行 Agent | 模型 |
|---------|-----------|------|
| Provider 实现 | ai-engineer | qwen3-coder-plus |
| CLI 开发 | senior-developer | qwen3-coder-plus |
| 工具实现 | backend-architect | qwen3-coder-plus |
| 测试编写 | test-results-analyzer | qwen3.5-plus |
| 文档编写 | content-creator | qwen3.5-plus |
| 项目管理 | project-shepherd | - |

### 工作流程

```
shmily (项目规划)
  ↓ 委托任务
agency-agents skill (ai-engineer + qwen3-coder-plus)
  ↓ 实现代码
代码提交
  ↓
shmily (审查)
  ↓ 批准
Git Push
```

## 📊 当前任务

### 任务 1: 实现 Anthropic Provider
- **文件**: `tasks/IMPLEMENT_ANTHROPIC_PROVIDER.md`
- **执行 Agent**: ai-engineer
- **模型**: qwen3-coder-plus
- **优先级**: 🔴 高
- **状态**: 📋 Todo

### 任务 2: 实现 DeepSeek Provider
- **文件**: `tasks/IMPLEMENT_DEEPSEEK_PROVIDER.md` (待创建)
- **执行 Agent**: ai-engineer
- **模型**: qwen3-coder-plus
- **优先级**: 🟡 中
- **状态**: 📋 Todo

### 任务 3: 实现 CLI 入口
- **文件**: `tasks/IMPLEMENT_CLI_ENTRY.md` (待创建)
- **执行 Agent**: senior-developer
- **模型**: qwen3-coder-plus
- **优先级**: 🔴 高
- **状态**: 📋 Todo

## 📈 项目统计

| 指标 | 数值 |
|------|------|
| 总任务数 | 60 |
| 已完成 | 9 (15%) |
| 待完成 | 51 (85%) |
| 文档数 | 16 |
| 代码文件 | 4 |
| Git 提交 | 9 |

## 🔧 配置

### 环境变量
```bash
export DASHSCOPE_API_KEY=your-api-key  # 阿里云
export ANTHROPIC_API_KEY=your-api-key  # Anthropic
export DEEPSEEK_API_KEY=your-api-key   # DeepSeek
```

### 配置文件
`~/.ergou/config.json`:
```json
{
  "providers": ["aliyun", "anthropic", "deepseek"],
  "defaultProvider": "aliyun",
  "defaultModel": "qwen3-coder-plus",
  "agents": {
    "coder": {
      "model": "qwen3-coder-plus",
      "provider": "aliyun"
    }
  }
}
```

## 📞 联系方式

- 负责人：shmily
- GitHub: https://github.com/shmily-xiao/ergou-cli
- 问题反馈：https://github.com/shmily-xiao/ergou-cli/issues

---

_最后更新：2026-04-02_
_版本：0.1.0_
_状态：开发中 (Phase 1, Week 1)_
