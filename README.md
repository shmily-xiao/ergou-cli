# Ergou CLI (饿狗 CLI)

[![npm version](https://img.shields.io/npm/v/ergou-cli.svg)](https://www.npmjs.com/package/ergou-cli)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/shmily-xiao/ergou-cli)](https://github.com/shmily-xiao/ergou-cli)

**🤖 通用大模型终端 Agent 工具** - 基于 Claude Code restored-src 代码重构，支持多厂商大模型

> **项目愿景**: 实现 Claude Code 的全部 Agent 能力，支持阿里云 Qwen、Anthropic Claude、DeepSeek、OpenAI 等多厂商大模型

---

## 🚀 快速开始

### 安装

```bash
# 从源码安装
git clone https://github.com/shmily-xiao/ergou-cli.git
cd ergou-cli
bun install
bun run build
bun link

# 使用
ergou --help
```

### 配置 API Key

```bash
# 阿里云 (推荐)
export DASHSCOPE_API_KEY=your-dashscope-api-key

# Anthropic
export ANTHROPIC_API_KEY=your-anthropic-api-key

# DeepSeek
export DEEPSEEK_API_KEY=your-deepseek-api-key

# OpenAI
export OPENAI_API_KEY=your-openai-api-key
```

### 开始对话

```bash
# 交互模式
ergou chat

# 单条消息
ergou chat "解释一下这段代码"

# 指定 Provider
ergou chat -p aliyun -m qwen3.5-plus

# 简写
ergou c "写一个快速排序"  # c = chat
```

---

## 🔧 命令系统

### 核心命令

| 命令 | 别名 | 描述 |
|------|------|------|
| `ergou chat [msg...]` | `c` | 开始对话或执行单条消息 |
| `ergou models` | `m` | 列出可用模型 |
| `ergou providers` | `p` | 列出可用 Provider |
| `ergou config` | `cfg` | 配置管理 |
| `ergou status` | `s` | 显示系统状态 |
| `ergou version` | `v` | 显示版本号 |

### 使用示例

```bash
# 查看帮助
ergou --help

# 查看状态
ergou status

# 列出阿里云模型
ergou models -p aliyun

# 列出 Anthropic 模型
ergou models -p anthropic

# 查看可用 Provider
ergou providers

# 开始对话
ergou chat

# 单条消息执行
ergou chat "分析这个文件的代码结构" src/main.ts

# 指定模型
ergou chat -p aliyun -m qwen3.5-plus "写一个二分查找"
```

---

## 📦 支持的模型

### 阿里云 (DashScope) ✅

| 模型 | 上下文 | 价格 (输入/输出) | 描述 |
|------|--------|----------------|------|
| `qwen3-coder-plus` | 256K | ¥2.5/¥10 | 代码专用模型 ⭐ |
| `qwen3.5-plus` | 256K | ¥2.5/¥10 | 通用模型，推荐 |
| `qwen-plus` | 131K | ¥2/¥6 | 平衡性能 |
| `qwen-max` | 32K | ¥40/¥120 | 高精度任务 |

### Anthropic Claude 🚧

| 模型 | 上下文 | 价格 (输入/输出) | 描述 |
|------|--------|----------------|------|
| `claude-sonnet-4-6` | 200K | $3/$15 | 日常使用推荐 ⭐ |
| `claude-opus-4-6` | 200K | $15/$75 | 复杂任务 |
| `claude-haiku-4-5` | 200K | $1/$5 | 快速响应 |

### DeepSeek 🚧

| 模型 | 上下文 | 价格 (输入/输出) | 描述 |
|------|--------|----------------|------|
| `deepseek-chat` | 128K | ¥1/¥4 | V3 聊天模型 |
| `deepseek-coder` | 128K | ¥1/¥4 | 代码专用模型 |

### OpenAI 🚧

| 模型 | 上下文 | 价格 (输入/输出) | 描述 |
|------|--------|----------------|------|
| `gpt-4o` | 128K | $5/$15 | 多模态能力 |
| `gpt-4o-mini` | 128K | $0.15/$0.6 | 高性价比 |

✅ 已实现 | 🚧 开发中

---

## 🛠️ 工具系统

Ergou CLI 支持类似 Claude Code 的工具系统：

### 内置工具

| 工具 | 描述 | 状态 |
|------|------|------|
| `bash` | 执行 Shell 命令 | ✅ |
| `file_read` | 读取文件内容 | ✅ |
| `file_write` | 写入文件内容 | ✅ |
| `file_edit` | 编辑文件 (diff 模式) | 🚧 |
| `grep` | 代码搜索 | 🚧 |
| `glob` | 文件匹配 | 🚧 |
| `git` | Git 操作 | 🚧 |
| `mcp` | MCP 工具调用 | 🚧 |

### 使用工具

```bash
# 启用工具系统
ergou chat --tools

# 工具会自动被 LLM 调用
ergou chat --tools "帮我读取 src/main.ts 并分析代码结构"
```

---

## 🏗️ 技术架构

```
┌─────────────────────────────────────────────────────────┐
│                    CLI Layer                            │
│  Commander (命令解析)                                   │
│  Commands: chat/models/providers/config/status         │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│              Provider Abstraction Layer                 │
│  BaseModelProvider (抽象基类)                           │
│  ProviderRegistry (注册表)                              │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│              Provider Implementations                   │
│  AliyunProvider  │ AnthropicProvider │ DeepSeekProvider │
│  OpenAIProvider  │ More coming soon...                  │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                  Tool System                            │
│  BashTool │ FileReadTool │ FileWriteTool │ More...     │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 项目统计

| 指标 | 数量 |
|------|------|
| Provider 实现 | 4 个 |
| 工具实现 | 3 个 |
| 类型定义 | 50+ 个 |
| 代码行数 | ~2000 行 |
| 依赖包 | 50+ 个 |
| Git 提交 | 10+ |

---

## 🔐 安全

- 命令执行前需要确认 (开发中)
- 敏感文件访问限制 (开发中)
- API Key 加密存储 (开发中)
- 操作审计日志 (开发中)

---

## 🤝 贡献

```bash
# Fork 项目
git clone https://github.com/shmily-xiao/ergou-cli.git

# 安装依赖
bun install

# 开发模式
bun run dev

# 构建
bun run build

# 运行测试
bun run test
```

---

## 📄 许可证

MIT License

---

## 🔗 相关链接

- **项目仓库**: https://github.com/shmily-xiao/ergou-cli
- **问题反馈**: https://github.com/shmily-xiao/ergou-cli/issues
- **项目文档**: `/Users/shmily/workspace/ergou-cli/docs/`
- **基于项目**: [claude-code-sourcemap](https://github.com/anthropics/claude-code-sourcemap)

---

## 💡 开发计划

### Phase 1 MVP (当前) ✅

- [x] 项目骨架
- [x] Provider 系统 (4 个厂商)
- [x] 工具系统 (基础工具)
- [x] CLI 命令系统
- [x] 构建系统
- [ ] 配置系统 (~/.ergou/config.json)
- [ ] UI 优化 (Ink TUI)
- [ ] 单元测试

### Phase 2 增强 (Next)

- [ ] 更多工具 (grep/glob/git/mcp)
- [ ] 文件编辑 (diff 模式)
- [ ] 代码审查
- [ ] Git 集成
- [ ] MCP 支持

### Phase 3 高级 (Future)

- [ ] 子 Agent 系统
- [ ] 任务规划
- [ ] 记忆系统
- [ ] 知识图谱
- [ ] npm 发布

---

**Made with ❤️ by shmily**

基于 [Claude Code restored-src](https://github.com/anthropics/claude-code-sourcemap) 重构
