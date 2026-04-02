# 委托任务给 Coder Agent

## 📋 当前任务

### 任务 1: 实现 Anthropic Provider

**文件**: `tasks/IMPLEMENT_ANTHROPIC_PROVIDER.md`

**执行方式**:

```bash
# 方式 1: 使用 ergou-cli (开发中)
ergou skill use coder-agent "实现 Anthropic Provider"

# 方式 2: 使用 OpenClaw Skill
/openclaw skill use agency-agents --agent frontend-developer "
查看 /Users/shmily/workspace/ergou-cli/tasks/IMPLEMENT_ANTHROPIC_PROVIDER.md
实现 Anthropic Provider
"

# 方式 3: 直接使用 agency-agents
/openclaw skill use agency-agents --agent ai-engineer "
帮我实现 ergou-cli 的 Anthropic Provider
参考：/Users/shmily/workspace/ergou-cli/src/providers/aliyun.ts
要求：
1. 创建 src/providers/anthropic.ts
2. 使用 @anthropic-ai/sdk
3. 支持 claude-sonnet-4-6, claude-opus-4-6, claude-haiku-4-5
4. 实现流式聊天
5. 添加到 ProviderRegistry
"
```

## 🎯 可用 Agent

根据 `agency-agents` skill，可用的工程类 Agent：

| Agent | 用途 | 适用任务 |
|-------|------|---------|
| `frontend-developer` | 前端开发 | React/Vue/HTML/CSS |
| `backend-architect` | 后端架构 | API/数据库/云 |
| `ai-engineer` | AI 工程 | ML/深度学习/AI 集成 ⭐ |
| `devops-automator` | DevOps | CI/CD/基础设施 |
| `rapid-prototyper` | 快速原型 | MVP/POC |
| `senior-developer` | 高级开发 | 复杂实现/架构 |

**推荐**: 使用 `ai-engineer` 或 `senior-developer` 来实现 Provider

## 📝 任务模板

```markdown
# Agent 任务委托

## 任务类型
代码实现

## 执行 Agent
ai-engineer (使用 qwen3-coder-plus 模型)

## 任务描述
[详细描述]

## 技术要求
- 语言：TypeScript
- 框架：Node.js 20+
- 参考文件：[文件路径]

## 验收标准
- [ ] 功能完整
- [ ] 类型安全
- [ ] 测试通过
- [ ] 代码审查通过

## 提交方式
git commit -m "feat: 实现 Anthropic Provider"
```

## 🔄 工作流程

1. **创建任务文件** → `tasks/TASK_NAME.md`
2. **委托给 Agent** → 使用 skill 系统
3. **Agent 执行** → qwen3-coder-plus 实现
4. **审核代码** → shmily 审查
5. **提交代码** → git push

## 📊 任务跟踪

| 任务 | Agent | 状态 | 模型 |
|------|-------|------|------|
| Anthropic Provider | ai-engineer | 📋 Todo | qwen3-coder-plus |
| DeepSeek Provider | ai-engineer | 📋 Todo | qwen3-coder-plus |
| OpenAI Provider | ai-engineer | 📋 Todo | qwen3-coder-plus |
| CLI 入口 | senior-developer | 📋 Todo | qwen3-coder-plus |
| 工具系统 | backend-architect | 📋 Todo | qwen3-coder-plus |

---

_最后更新：2026-04-02_
