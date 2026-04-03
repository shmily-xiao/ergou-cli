# 🚀 ergou-cli 快速开发计划

**策略**: 直接复用 claude-code-sourcemap 的代码，快速构建 MVP

---

## ✅ 已完成

### 1. 代码复制 ✅
- [x] BashTool (160KB) - 完整的 shell 执行工具
- [x] FileReadTool (39KB) - 文件读取工具
- [x] FileWriteTool (15KB) - 文件写入工具
- [x] GrepTool (20KB) - 代码搜索工具
- [x] GlobTool (6KB) - 文件匹配工具
- [x] Tool.ts (29KB) - 工具系统核心
- [x] Task.ts (3KB) - 任务管理
- [x] cost-tracker.ts (10KB) - 成本追踪

### 2. 项目骨架 ✅
- [x] package.json (完整依赖)
- [x] tsconfig.json
- [x] tsup.config.ts
- [x] Git 仓库

### 3. Provider 实现 ✅
- [x] 阿里云 Qwen (aliyun.ts)
- [x] Anthropic Claude (anthropic.ts)
- [x] DeepSeek (deepseek.ts)
- [x] OpenAI (openai.ts)

---

## 🎯 立即执行 (今天完成)

### 任务 1: 整合 Tool 系统
**目标**: 让复制的工具能在 ergou-cli 中使用

**步骤**:
1. 简化 Tool.ts - 只保留核心接口
2. 适配已复制的工具到 ergou-cli 架构
3. 创建工具注册表

**文件**:
```
src/tools/registry.ts      # 工具注册表
src/tools/index.ts         # 统一导出
```

### 任务 2: 整合 CLI 入口
**目标**: 让 CLI 能真正运行起来

**步骤**:
1. 更新 src/cli.ts - 使用复制的代码
2. 添加 Provider 选择逻辑
3. 添加工具调用逻辑

### 任务 3: 测试运行
**目标**: 能执行简单对话

**测试命令**:
```bash
bun run dev
# 测试对话
# 测试文件读取
# 测试 shell 执行
```

---

## 📅 本周完成 (Phase 1 MVP)

### 任务 4: 完善工具系统
- [ ] BashTool - 安全审查 + 执行
- [ ] FileReadTool - 支持大文件分块
- [ ] FileWriteTool - 支持 diff 编辑
- [ ] GrepTool - 正则搜索
- [ ] GlobTool - 文件匹配

### 任务 5: 配置系统
- [ ] ~/.ergou/config.json
- [ ] 环境变量支持
- [ ] Provider 切换

### 任务 6: UI 优化
- [ ] Ink TUI 界面
- [ ] Markdown 渲染
- [ ] 代码高亮
- [ ] 流式输出

---

## 📊 代码统计

### 已复制核心代码
| 模块 | 大小 | 状态 |
|------|------|------|
| BashTool | 160KB | ✅ 已复制 |
| Tool.ts | 29KB | ✅ 已复制 |
| FileReadTool | 39KB | ✅ 已复制 |
| GrepTool | 20KB | ✅ 已复制 |
| cost-tracker | 10KB | ✅ 已复制 |
| FileWriteTool | 15KB | ✅ 已复制 |
| GlobTool | 6KB | ✅ 已复制 |
| **总计** | **~280KB** | **✅** |

### 需要整合的代码
| 模块 | 优先级 | 预计时间 |
|------|--------|---------|
| Tool 系统整合 | 🔴 P0 | 2h |
| CLI 入口整合 | 🔴 P0 | 2h |
| 配置系统 | 🟡 P1 | 1h |
| UI 优化 | 🟡 P1 | 3h |

---

## 🎯 MVP 验收标准

### 能做什么
- ✅ 启动 CLI 交互模式
- ✅ 选择 Provider (Qwen/Claude/DeepSeek/OpenAI)
- ✅ 执行简单对话
- ✅ 读取文件
- ✅ 写入文件
- ✅ 执行 shell 命令
- ✅ 代码搜索

### 性能指标
- 启动时间 < 1s
- 响应延迟 < 500ms
- 内存占用 < 200MB

---

## 🚀 下一步行动

**立即执行**:
1. 创建 `src/tools/registry.ts` - 工具注册表
2. 更新 `src/cli.ts` - 整合 Tool 系统
3. 测试运行

**预计完成时间**: 今天内完成 MVP

---

_更新时间：2026-04-03 09:15_
_策略：快速复用，避免重复造轮子_
