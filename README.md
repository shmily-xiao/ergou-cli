# Ergou CLI

[![npm version](https://img.shields.io/npm/v/ergou-cli.svg)](https://www.npmjs.com/package/ergou-cli)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**通用大模型终端 Agent 工具** - 基于 Claude Code restored-src 代码重构，支持多厂商大模型

## 🚀 特性

- 🔌 **多模型支持** - Anthropic Claude、阿里云 Qwen、DeepSeek、OpenAI GPT、Moonshot Kimi、智谱 GLM
- 🛠️ **完整工具链** - 文件操作、Shell 执行、Git 集成、代码搜索、MCP 支持
- 🤖 **Agent 能力** - 任务规划、多轮对话、工具调用、子 Agent 协作
- 💰 **成本透明** - 实时显示 token 使用和成本
- 🔒 **安全可靠** - 权限控制、命令沙箱、审计日志
- 🎨 **优秀体验** - 流式输出、语法高亮、TUI 界面

## 📦 安装

```bash
# 从源码安装
git clone https://github.com/shmily/ergou-cli.git
cd ergou-cli
bun install
bun run build
bun link

# 使用
ergou
```

## 🔧 配置

创建配置文件 `~/.ergou/config.json`:

```json
{
  "providers": [
    {
      "name": "aliyun",
      "apiKey": "your-dashscope-api-key"
    },
    {
      "name": "deepseek",
      "apiKey": "your-deepseek-api-key"
    },
    {
      "name": "anthropic",
      "apiKey": "your-anthropic-api-key"
    }
  ],
  "defaultProvider": "aliyun",
  "defaultModel": "qwen3.5-plus",
  "ui": {
    "theme": "dark",
    "showTokenUsage": true,
    "showCost": true
  }
}
```

或使用环境变量:

```bash
export ERGOU_PROVIDER=aliyun
export DASHSCOPE_API_KEY=your-api-key
export DEEPSEEK_API_KEY=your-api-key
```

## 💡 使用

### 基础对话

```bash
# 启动交互模式
ergou

# 直接提问
ergou "解释一下这个函数的作用"

# 指定模型
ergou --model qwen3.5-plus "写一个快速排序"
```

### 文件操作

```bash
# 分析文件
ergou "分析这个文件的代码结构" src/main.ts

# 修改文件
ergou "添加错误处理" src/api.ts

# 创建文件
ergou "创建一个 React 组件，包含 props 类型定义" MyComponent.tsx
```

### Git 集成

```bash
# 代码审查
ergou "审查这个 commit 的改动"

# 生成提交信息
ergou "生成提交信息"
```

### 多模型切换

```bash
# 查看可用模型
ergou /models

# 切换模型
ergou /model deepseek-chat

# 对比不同模型的回答
ergou /switch
```

## 🛠️ 工具系统

支持的内置工具:

| 工具 | 描述 |
|------|------|
| `bash` | 执行 Shell 命令 |
| `file_read` | 读取文件内容 |
| `file_write` | 写入文件 |
| `file_edit` | 编辑文件（diff 模式） |
| `grep` | 代码搜索 |
| `glob` | 文件匹配 |
| `git` | Git 操作 |
| `agent` | 调用子 Agent |
| `web_search` | 网络搜索 |
| `mcp` | MCP 工具调用 |

## 📊 支持的模型

### 阿里云 (DashScope) ✅
- `qwen3.5-plus` - 最强代码能力，256K 上下文
- `qwen-plus` - 平衡性能，131K 上下文
- `qwen-max` - 高精度任务

### DeepSeek 🚧
- `deepseek-chat` - V3 聊天模型，128K 上下文
- `deepseek-coder` - 代码专用模型

### Anthropic 🚧
- `claude-sonnet-4-6` - 日常使用推荐
- `claude-opus-4-6` - 复杂任务

### OpenAI 🚧
- `gpt-4o` - 多模态能力
- `gpt-4o-mini` - 高性价比

### Moonshot (Kimi) 🚧
- `moonshot-v1-128k` - 超长上下文
- `moonshot-v1-32k` - 平衡选择

### 智谱 AI 🚧
- `glm-4` - 通用模型
- `glm-4-flash` - 快速响应

✅ 已实现 | 🚧 开发中

## 🔐 安全

- 命令执行前需要确认
- 敏感文件访问限制
- API Key 加密存储
- 操作审计日志

## 📈 性能指标

- 响应延迟：< 500ms (本地工具)
- 内存占用：< 200MB
- 启动时间：< 1s
- 工具执行成功率：> 95%

## 🤝 贡献

```bash
# Fork 项目
git clone https://github.com/shmily/ergou-cli.git

# 安装依赖
bun install

# 开发模式
bun run dev

# 运行测试
bun run test

# 构建
bun run build
```

## 📄 许可证

MIT License

## 🔗 链接

- [项目文档](docs/)
- [问题反馈](https://github.com/shmily/ergou-cli/issues)
- [技术架构](docs/ARCHITECTURE.md)

---

**Made with ❤️ by shmily**

基于 [Claude Code restored-src](https://github.com/anthropics/claude-code-sourcemap) 重构
