# 🤖 使用 agency-agents skill 委托任务

## 📋 当前任务

### 任务 001: Anthropic Provider 实现
**文件**: `tasks/001_IMPLEMENT_ANTHROPIC_PROVIDER.md`
**执行 Agent**: `ai-engineer`
**使用模型**: `qwen3-coder-plus`

## 🚀 开始委托

### 方式 1: 使用 OpenClaw Skill (推荐)

```bash
/openclaw skill use agency-agents --agent ai-engineer "
请查看并执行任务：
/Users/shmily/workspace/ergou-cli/tasks/001_IMPLEMENT_ANTHROPIC_PROVIDER.md

项目位置：/Users/shmily/workspace/ergou-cli/
参考文件：src/providers/aliyun.ts
要求：
1. 创建 src/providers/anthropic.ts
2. 使用 @anthropic-ai/sdk
3. 支持 claude-sonnet-4-6, claude-opus-4-6, claude-haiku-4-5
4. 实现流式聊天
5. 添加到 ProviderRegistry
6. 完成后提交 Git
"
```

### 方式 2: 使用命令行

```bash
cd /Users/shmily/workspace/ergou-cli
# 查看任务
cat tasks/001_IMPLEMENT_ANTHROPIC_PROVIDER.md

# 委托给 ai-engineer (使用 qwen3-coder-plus)
/openclaw skill use agency-agents --agent ai-engineer "实现 Anthropic Provider，参考 aliyun.ts"
```

## 📊 任务队列

| 任务 ID | 任务名称 | 执行 Agent | 状态 |
|--------|---------|-----------|------|
| 001 | Anthropic Provider | ai-engineer | 📋 待执行 |
| 002 | DeepSeek Provider | ai-engineer | 📋 待办 |
| 003 | OpenAI Provider | ai-engineer | 📋 待办 |
| 004 | CLI 入口 | senior-developer | 📋 待办 |
| 005 | 工具系统 | backend-architect | 📋 待办 |

## 🔄 工作流程

```
1. 创建任务文件 → tasks/001_*.md
2. 委托给 Agent → /openclaw skill use agency-agents --agent <agent-name>
3. Agent 执行 → 使用 qwen3-coder-plus 实现
4. 审查代码 → git diff
5. 批准提交 → git commit && git push
```

## 🎯 下一步

**立即执行**:
```bash
/openclaw skill use agency-agents --agent ai-engineer "
执行任务 001: 实现 Anthropic Provider
查看：/Users/shmily/workspace/ergou-cli/tasks/001_IMPLEMENT_ANTHROPIC_PROVIDER.md
参考：/Users/shmily/workspace/ergou-cli/src/providers/aliyun.ts
使用模型：qwen3-coder-plus
"
```

---

_创建时间：2026-04-02_
_状态：准备委托_
