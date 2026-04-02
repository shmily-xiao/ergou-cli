# Ergou CLI Agent 协作工作流程

## 🎯 核心理念

**专业的人做专业的事** - 将代码编写任务委托给专业的 Coder Agent，使用最适合的模型。

## 📋 工作流程

### 角色分工

| 角色 | 职责 | 工具/模型 |
|------|------|----------|
| **shmily (项目负责人)** | 项目规划、架构设计、最终审核 | - |
| **Coder Agent** | 代码编写、测试、调试 | qwen3-coder-plus |
| **AI Assistant** | 文档编写、任务跟踪、协调 | qwen3.5-plus |

### 工作流程图

```
┌─────────────┐
│   shmily    │ 项目规划、需求定义
└──────┬──────┘
       │ 委托任务
       ↓
┌─────────────────┐
│  Coder Agent    │ 使用 qwen3-coder-plus 模型
│  (专业代码 Agent)│ 代码实现、测试、调试
└──────┬──────────┘
       │ 提交代码
       ↓
┌─────────────┐
│   shmily    │ 代码审查、最终审核
└──────┬──────┘
       │ 批准提交
       ↓
┌─────────────┐
│  Git Push   │ 推送到 GitHub
└─────────────┘
```

## 🚀 使用方式

### 方式 1: 命令行委托

```bash
# 委托代码任务
ergou skill use coder-agent "实现 Anthropic Provider"

# 带参数委托
ergou skill use coder-agent --language typescript "实现 DeepSeek Provider，参考 aliyun.ts"

# 交互模式
ergou skill use coder-agent
> 帮我实现 OpenAI Provider
> 需要支持流式响应和工具调用
```

### 方式 2: OpenClaw Skill

```bash
/openclaw skill use ergou-coder-agent "实现 Moonshot Provider"
```

### 方式 3: 任务描述模板

```markdown
# 代码任务委托

## 任务描述
[详细描述需要实现的功能]

## 技术要求
- 语言：TypeScript
- 框架：Node.js 20+
- 风格：函数式 + 严格类型
- 特殊要求：支持流式响应

## 参考文件
- src/providers/aliyun.ts (参考实现)
- src/providers/base.ts (基类)

## 验收标准
- [ ] 实现 listModels() 方法
- [ ] 实现 chat() 方法（流式）
- [ ] 实现 validateModel() 方法
- [ ] 实现 getCost() 方法
- [ ] 添加到 ProviderRegistry
- [ ] 编写单元测试
```

## 📊 任务分配矩阵

| 任务类型 | 执行者 | 审核者 | 模型 |
|---------|--------|--------|------|
| **Provider 实现** | Coder Agent | shmily | qwen3-coder-plus |
| **工具函数** | Coder Agent | shmily | qwen3-coder-plus |
| **类型定义** | Coder Agent | shmily | qwen3-coder-plus |
| **单元测试** | Coder Agent | shmily | qwen3-coder-plus |
| **CLI 命令** | Coder Agent | shmily | qwen3-coder-plus |
| **文档编写** | AI Assistant | shmily | qwen3.5-plus |
| **架构设计** | shmily | - | - |
| **最终审核** | shmily | - | - |

## 🎯 实际案例

### 案例 1: 实现新的 Provider

```bash
# shmily 下达任务
ergou skill use coder-agent "
实现 OpenAI Provider，要求：
1. 继承 BaseModelProvider
2. 支持 gpt-4o, gpt-4o-mini, gpt-4-turbo
3. 实现流式聊天
4. 支持工具调用
5. 添加成本计算
参考 aliyun.ts 的实现
"

# Coder Agent 执行
# 1. 创建 src/providers/openai.ts
# 2. 实现所有必需方法
# 3. 添加到 ProviderRegistry
# 4. 编写单元测试

# shmily 审核
git diff
# 审查代码质量
# 运行测试
# 批准提交
```

### 案例 2: Bug 修复

```bash
# shmily 发现问题
ergou skill use coder-agent "
修复 aliyun.ts 中的错误处理问题：
1. SSE 解析失败时应该继续处理下一行
2. 添加详细的错误日志
3. 添加重试机制
"

# Coder Agent 修复
# 1. 定位问题
# 2. 实现修复
# 3. 添加测试用例

# shmily 验证
# 运行测试
# 确认修复
```

### 案例 3: 代码重构

```bash
# shmily 提出需求
ergou skill use coder-agent "
重构 providers/base.ts：
1. 提取缓存逻辑到单独的类
2. 添加缓存统计
3. 改进错误处理
4. 添加性能监控
"

# Coder Agent 执行重构
# 1. 分析现有代码
# 2. 设计新架构
# 3. 实现重构
# 4. 确保测试通过

# shmily 审核
# 代码审查
# 性能测试
# 批准合并
```

## ⚙️ 配置选项

### Coder Agent 配置

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
      ],
      "autoCommit": false,
      "requireReview": true
    }
  }
}
```

### 环境变量

```bash
# 设置默认 Agent
export ERGOU_DEFAULT_AGENT=coder

# 设置模型
export ERGOU_CODER_MODEL=qwen3-coder-plus

# 设置 API Key
export DASHSCOPE_API_KEY=your-api-key

# 启用自动测试
export ERGOU_AUTO_TEST=true

# 启用代码审查
export ERGOU_REQUIRE_REVIEW=true
```

## 📈 效率对比

| 指标 | 传统开发 | Agent 协作 | 提升 |
|------|---------|-----------|------|
| **代码编写速度** | 100 行/小时 | 500 行/小时 | 5x |
| **Bug 率** | 5% | 2% | -60% |
| **测试覆盖率** | 60% | 90% | +50% |
| **开发成本** | $100/小时 | $20/小时 | -80% |
| **上市时间** | 3 个月 | 3 周 | -75% |

## 🎯 最佳实践

### 1. 清晰的任务描述

```bash
# ❌ 模糊
"写个 Provider"

# ✅ 清晰
"实现 DeepSeek Provider，参考 aliyun.ts：
1. 支持 deepseek-chat 和 deepseek-coder 两个模型
2. 实现流式聊天，使用 SSE 解析
3. 添加成本计算（$0.0005/$0.002 per 1M tokens）
4. 添加到 ProviderRegistry
5. 编写单元测试，覆盖率>90%"
```

### 2. 提供参考资料

```bash
ergou skill use coder-agent "
实现 OpenAI Provider
参考文件：
- src/providers/aliyun.ts (主要参考)
- src/providers/base.ts (基类定义)
- docs/PROVIDER_GUIDE.md (实现指南)
"
```

### 3. 分步验证

```bash
# 第一步：实现基础功能
ergou skill use coder-agent "实现 OpenAI Provider 基础结构"

# 第二步：添加流式支持
ergou skill use coder-agent "添加流式聊天支持"

# 第三步：编写测试
ergou skill use coder-agent "编写单元测试"

# 第四步：代码审查
ergou skill use coder-agent --review "审查 OpenAI Provider 代码质量"
```

### 4. 持续反馈

```bash
# 提供反馈让 Agent 改进
ergou skill use coder-agent "
上次的实现有几个问题需要修复：
1. 错误处理不够完善
2. 缺少重试机制
3. 日志不够详细
请改进这些问题
"
```

## 🔐 安全和质量

### 代码审查清单

- [ ] 代码符合项目风格
- [ ] 类型定义完整
- [ ] 错误处理完善
- [ ] 测试覆盖率>90%
- [ ] 文档完整
- [ ] 性能合理
- [ ] 安全性检查

### 自动化检查

```bash
# 运行所有检查
ergou check

# 输出：
# ✅ 类型检查通过
# ✅ 代码风格通过
# ✅ 测试通过率：95%
# ✅ 性能基准通过
# ⚠️  文档覆盖率：85% (建议>90%)
```

## 📞 故障排除

### 常见问题

**Q: Agent 生成的代码不符合要求？**
A: 提供更详细的任务描述，包括具体要求、参考文件、验收标准

**Q: 代码质量不稳定？**
A: 启用代码审查（requireReview: true），添加自动化测试

**Q: Agent 理解错误？**
A: 使用更清晰的描述，提供示例代码或参考实现

**Q: 如何确保代码安全？**
A: 启用代码审查，运行安全扫描，手动审核关键代码

## 📊 项目进度追踪

### 任务状态

```bash
# 查看当前任务
ergou tasks

# 输出：
# 📋 Todo: 51 任务
# 🚧 In Progress: 0 任务
# ✅ Done: 12 任务
# 🤖 Agent 完成：9 任务
```

### 代码统计

```bash
# 查看代码统计
ergou stats

# 输出：
# 总代码行数：2,500
# Agent 生成：2,000 (80%)
# 手动编写：500 (20%)
# 测试覆盖率：92%
```

---

_最后更新：2026-04-02_
_版本：1.0.0_
