# 🚀 启动 Agent 团队 - Ergou CLI 项目开发

## 📋 项目简报

**项目**: Ergou CLI - 通用大模型终端 Agent 工具
**位置**: `/Users/shmily/workspace/ergou-cli/`
**GitHub**: https://github.com/shmily-xiao/ergou-cli
**文档**: `PROJECT_BRIEF.md`

## 🎯 任务分配

### Engineering 部门

#### 1. ai-engineer (使用 qwen3-coder-plus 模型)
**任务**: 实现所有 Provider
- [ ] Anthropic Provider (`src/providers/anthropic.ts`)
- [ ] DeepSeek Provider (`src/providers/deepseek.ts`)
- [ ] OpenAI Provider (`src/providers/openai.ts`)
- [ ] Moonshot Provider (`src/providers/moonshot.ts`)
- [ ] 智谱 Provider (`src/providers/zhipu.ts`)

**参考**: `src/providers/aliyun.ts`

#### 2. senior-developer (使用 qwen3-coder-plus 模型)
**任务**: CLI 入口和核心
- [ ] CLI 入口 (`src/cli.ts`)
- [ ] 命令解析
- [ ] 交互模式
- [ ] 流式输出渲染

#### 3. backend-architect (使用 qwen3-coder-plus 模型)
**任务**: 工具系统
- [ ] Bash 工具 (`src/tools/bash.ts`)
- [ ] 文件读取 (`src/tools/file-read.ts`)
- [ ] 文件写入 (`src/tools/file-write.ts`)
- [ ] Grep 搜索 (`src/tools/grep.ts`)
- [ ] Git 工具 (`src/tools/git.ts`)

#### 4. devops-automator
**任务**: DevOps 和 CI/CD
- [ ] GitHub Actions 配置
- [ ] 自动化测试
- [ ] 发布流程

### Testing 部门

#### 5. test-results-analyzer
**任务**: 测试和质量
- [ ] 单元测试编写
- [ ] 集成测试
- [ ] 测试覆盖率报告

### Support 部门

#### 6. analytics-reporter
**任务**: 数据分析和报告
- [ ] 项目进度报告
- [ ] 代码质量分析
- [ ] 性能基准测试

### Product 部门

#### 7. content-creator
**任务**: 文档编写
- [ ] API 文档
- [ ] 使用指南
- [ ] 示例代码

## 🔄 工作流程

```bash
# 1. 委托任务给 ai-engineer
/openclaw skill use agency-agents --agent ai-engineer "
查看 /Users/shmily/workspace/ergou-cli/PROJECT_BRIEF.md
实现 Anthropic Provider
参考：src/providers/aliyun.ts
要求：
- 创建 src/providers/anthropic.ts
- 使用 @anthropic-ai/sdk
- 支持 claude-sonnet-4-6, claude-opus-4-6, claude-haiku-4-5
- 实现流式聊天
- 添加到 ProviderRegistry
"

# 2. ai-engineer 执行任务 (使用 qwen3-coder-plus)
# 3. 审查代码
git diff
# 4. 批准提交
git commit -m "feat: Anthropic Provider by ai-engineer"
git push
```

## 📊 任务优先级

| 优先级 | 任务 | 执行 Agent | 状态 |
|--------|------|-----------|------|
| 🔴 P0 | Anthropic Provider | ai-engineer | 📋 Todo |
| 🔴 P0 | CLI 入口 | senior-developer | 📋 Todo |
| 🟡 P1 | DeepSeek Provider | ai-engineer | 📋 Todo |
| 🟡 P1 | 基础工具 | backend-architect | 📋 Todo |
| 🟢 P2 | 其他 Provider | ai-engineer | 📋 Todo |
| 🟢 P2 | 测试编写 | test-results-analyzer | 📋 Todo |

## 🎯 开始执行

### 第一步：启动 ai-engineer

```bash
/openclaw skill use agency-agents --agent ai-engineer "
项目：ergou-cli
任务：实现 Anthropic Provider
位置：/Users/shmily/workspace/ergou-cli/
参考：src/providers/aliyun.ts
模型：使用 qwen3-coder-plus
要求：
1. 创建 src/providers/anthropic.ts
2. 继承 BaseModelProvider
3. 使用 @anthropic-ai/sdk
4. 支持 3 个 Claude 模型
5. 实现流式聊天
6. 添加成本计算
7. 注册到 ProviderRegistry
8. 编写单元测试
完成后提交 Git
"
```

### 第二步：启动 senior-developer

```bash
/openclaw skill use agency-agents --agent senior-developer "
项目：ergou-cli
任务：实现 CLI 入口
位置：/Users/shmily/workspace/ergou-cli/
参考：查看现有代码结构
模型：使用 qwen3-coder-plus
要求：
1. 创建 src/cli.ts
2. 使用 commander 解析命令
3. 实现交互模式
4. 支持流式输出
5. 添加模型选择
6. 集成 ProviderRegistry
完成后提交 Git
"
```

### 第三步：启动 backend-architect

```bash
/openclaw skill use agency-agents --agent backend-architect "
项目：ergou-cli
任务：实现基础工具系统
位置：/Users/shmily/workspace/ergou-cli/
模型：使用 qwen3-coder-plus
要求：
1. 创建 src/tools/ 目录
2. 实现 bash, file-read, file-write, grep, git 工具
3. 添加权限控制
4. 编写测试
完成后提交 Git
"
```

## 📈 进度跟踪

使用 memorybridge 记录进度：

```bash
memory_add "启动 ai-engineer 实现 Anthropic Provider" type="session" priority="p1"
memory_add "ai-engineer 完成 Anthropic Provider" type="long_term" priority="p1" tags=["completed", "provider"]
```

## 🎉 完成标准

- [ ] 所有 Provider 实现完成
- [ ] CLI 可以正常使用
- [ ] 工具系统完整
- [ ] 测试覆盖率>80%
- [ ] 文档完整
- [ ] GitHub 发布 v0.2.0

---

_创建时间：2026-04-02_
_执行者：agency-agents skill_
_模型：qwen3-coder-plus (Coder Agent)_
