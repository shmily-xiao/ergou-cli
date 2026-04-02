# Ergou CLI 变更日志

所有重要的项目变更都将记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

---

## [Unreleased] - 2026-04-02

### 计划中 (Planned)

#### Added
- Anthropic Claude Provider 支持
- DeepSeek Provider 支持
- OpenAI GPT Provider 支持
- Moonshot Kimi Provider 支持
- 智谱 GLM Provider 支持
- CLI 基础命令解析
- 交互模式
- Bash 执行工具
- 文件读取工具
- 文件写入工具
- Grep 搜索工具
- Git 集成工具

#### Changed
- 无

#### Deprecated
- 无

#### Removed
- 无

#### Fixed
- 无

#### Security
- 无

---

## [0.1.0] - 2026-04-02

项目初始化版本

### Added

#### 核心功能
- **项目骨架** - 完整的 TypeScript + Bun 项目结构
- **类型系统** - 50+ 核心类型定义
  - Message / ContentBlock 消息类型
  - ModelInfo / ModelPricing 模型信息
  - ChatOptions / ChatChunk 聊天接口
  - TokenUsage / CostInfo 成本和 Token
  - Tool / ToolResult 工具系统
  - Agent / Task Agent 系统
  - Session / Config 配置管理
  - ErgouError / ProviderError 错误类型

- **Provider 架构**
  - BaseModelProvider 抽象基类
  - ProviderRegistry 注册表 (单例模式)
  - 模型缓存机制 (5 分钟 TTL)
  - 成本计算通用实现
  - 错误重试逻辑 (指数退避)

- **阿里云 Provider** ✅
  - 支持 3 个模型 (qwen3.5-plus, qwen-plus, qwen-max)
  - 完整的模型信息 (上下文、价格、能力)
  - 流式聊天实现 (SSE)
  - 工具调用支持
  - 成本计算
  - 错误处理

#### 文档系统
- **README.md** - 项目说明和使用指南
- **DEVELOPMENT.md** - 开发指南和模板
- **PROJECT_SUMMARY.md** - 项目总结
- **docs/README.md** - 文档中心导航
- **docs/OVERVIEW.md** - 项目概述和架构
- **docs/DEVLOG.md** - 开发日志
- **docs/TASKS.md** - 任务看板
- **docs/CHANGELOG.md** - 本文件

#### 开发工具
- TypeScript 严格模式配置
- tsup 构建系统 (ESM + DTS)
- ESLint + Prettier 代码规范
- Vitest 测试框架
- 路径别名 (@/, @providers/, @agent/, etc.)

#### Git 管理
- Git 仓库初始化
- GitHub 仓库创建
- 3 次初始提交
- 完整的 .gitignore

### Changed
- 无 (初始版本)

### Deprecated
- 无

### Removed
- 无

### Fixed
- 无

### Security
- 无

---

## 版本说明

### [0.1.0] - MVP 初始化版本

这是 Ergou CLI 的第一个版本，包含：
- ✅ 完整的项目骨架
- ✅ 类型系统定义
- ✅ Provider 抽象层
- ✅ 阿里云 Provider 示例
- ✅ 文档系统

**目标**: 证明技术可行性，为后续开发奠定基础

**状态**: 开发中 (Phase 1, Week 1)

---

## 发布计划

| 版本 | 计划日期 | 目标 |
|------|---------|------|
| 0.1.0 | 2026-04-02 | ✅ 项目初始化 |
| 0.2.0 | 2026-04-12 | MVP (基础对话 + 文件操作) |
| 0.5.0 | 2026-05-12 | Agent 核心 (任务规划 + 工具系统) |
| 0.8.0 | 2026-06-12 | 高级功能 (MCP + 子 Agent + 记忆) |
| 1.0.0 | 2026-07-30 | 生产就绪版本 |

---

## 贡献者

- shmily (项目负责人)
- AI Assistant (初始开发)

---

## 相关链接

- [项目仓库](https://github.com/shmily-xiao/ergou-cli)
- [问题反馈](https://github.com/shmily-xiao/ergou-cli/issues)
- [开发指南](../DEVELOPMENT.md)
- [任务看板](./TASKS.md)

---

_最后更新：2026-04-02_
_当前版本：0.1.0_
_下一版本：0.2.0 (计划 2026-04-12)_
