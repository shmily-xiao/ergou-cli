# Ergou CLI 记忆管理 (MemoryBridge)

## 🧠 记忆系统概述

使用 **MemoryBridge** skill 管理项目记忆，实现跨 Agent 知识共享。

## 📋 记忆分类

### P0 - 最高优先级 (用户偏好、安全相关)
- 项目负责人：shmily
- 项目位置：`/Users/shmily/workspace/ergou-cli/`
- GitHub 仓库：https://github.com/shmily-xiao/ergou-cli
- API Key 配置：环境变量存储

### P1 - 高优先级 (知识点、任务历史)
- 代码 Agent 使用 qwen3-coder-plus 模型
- 使用 agency-agents skill 委托代码任务
- 使用 memorybridge skill 管理记忆
- Provider 架构设计
- 技术栈决策

### P2 - 中优先级 (对话摘要)
- 开发日志
- 会议记录
- 决策过程

### P3 - 低优先级 (临时上下文)
- 临时笔记
- 待办事项

## 🔧 使用方式

### 添加记忆

```bash
# 添加项目信息 (P0)
memory_add("ergou-cli 项目位置：/Users/shmily/workspace/ergou-cli", 
           type="long_term", priority="p0", 
           tags=["project", "location"])

# 添加技术决策 (P1)
memory_add("代码 Agent 使用 qwen3-coder-plus 模型 (阿里云)", 
           type="long_term", priority="p1", 
           tags=["agent", "model", "qwen3-coder-plus"])

# 添加工作流程 (P1)
memory_add("使用 agency-agents skill 委托代码任务给 ai-engineer", 
           type="long_term", priority="p1", 
           tags=["workflow", "agency-agents"])

# 添加记忆工具 (P1)
memory_add("使用 memorybridge skill 管理项目记忆", 
           type="long_term", priority="p1", 
           tags=["memorybridge", "tools"])
```

### 搜索记忆

```bash
# 搜索模型相关
memory_search("qwen3-coder-plus", limit=10)

# 搜索 Agent 相关
memory_search("agency-agents", type="long_term", limit=10)

# 搜索项目信息
memory_search("ergou-cli", priority="p0", limit=5)
```

### 列出记忆

```bash
# 列出所有 P0 记忆
memory_list(priority="p0", limit=20)

# 列出所有项目相关记忆
memory_list(tags=["project"], limit=50)
```

## 📊 记忆模板

### 项目信息模板

```markdown
# 项目信息

## 基本信息
- 项目名称：ergou-cli
- 负责人：shmily
- 位置：/Users/shmily/workspace/ergou-cli/
- GitHub: https://github.com/shmily-xiao/ergou-cli
- 启动日期：2026-04-02

## 技术栈
- 语言：TypeScript 5.x
- 运行时：Node.js 20+ / Bun 1.3+
- 构建：tsup
- 测试：Vitest
```

### 技术决策模板

```markdown
# 技术决策：[决策名称]

## 决策内容
[详细描述]

## 选择理由
[为什么这样选择]

## 替代方案
[考虑过的其他方案]

## 影响
[这个决策的影响]

## 日期
2026-04-02
```

### 任务历史模板

```markdown
# 任务：[任务名称]

## 执行者
[Agent 名称 + 模型]

## 任务描述
[任务内容]

## 执行结果
[完成情况]

## 时间
[执行日期]
```

## 🎯 实际使用案例

### 案例 1: 记录项目启动

```bash
memory_add "
ergou-cli 项目于 2026-04-02 启动
- 目标：创建通用大模型终端 Agent 工具
- 支持多厂商模型 (Claude/Qwen/DeepSeek/OpenAI 等)
- 使用 agency-agents skill 委托代码任务
- Coder Agent 使用 qwen3-coder-plus 模型
- 使用 memorybridge 管理记忆
" type="long_term" priority="p0" tags=["project", "startup"]
```

### 案例 2: 记录技术决策

```bash
memory_add "
技术决策：选择 Qwen3-Coder-Plus 作为代码 Agent 模型
理由:
1. HumanEval 85.2% (业界第一)
2. MBPP 82.5% (代码能力强)
3. 成本$0.002/$0.006 per 1M tokens (性价比高)
4. 256K 上下文 (支持大项目)
5. 中文支持好
" type="long_term" priority="p1" tags=["model", "qwen3-coder-plus", "decision"]
```

### 案例 3: 记录工作流程

```bash
memory_add "
ergou-cli 开发工作流程:
1. shmily 定义任务和需求
2. 使用 agency-agents skill 委托给 ai-engineer
3. ai-engineer 使用 qwen3-coder-plus 实现代码
4. shmily 审查和测试
5. ai-engineer 修复和改进
6. shmily 最终审核和提交
" type="long_term" priority="p1" tags=["workflow", "process"]
```

## 📈 记忆统计

### 按优先级

| 优先级 | 数量 | 用途 |
|--------|------|------|
| P0 | 5-10 | 项目核心信息 |
| P1 | 20-50 | 技术决策、知识点 |
| P2 | 50-100 | 对话摘要、日志 |
| P3 | 不限 | 临时笔记 |

### 按类型

| 类型 | 数量 | 说明 |
|------|------|------|
| long_term | 100+ | 长期记忆 |
| session | 不限 | Session 临时记忆 |

## ⚙️ 配置

### openclaw.json

```json
{
  "skills": {
    "entries": {
      "memorybridge": {
        "db_path": "~/.ergou/memory.db",
        "auto_backup": true,
        "backup_interval": "daily"
      }
    }
  }
}
```

### 环境变量

```bash
# MemoryBridge 配置
export MEMORYBRIDGE_DB_PATH=~/.ergou/memory.db
export MEMORYBRIDGE_AUTO_BACKUP=true
```

## 🔐 安全考虑

### 敏感信息处理

```bash
# ❌ 不要存储
memory_add "API Key: sk-abc123..."  # 危险！

# ✅ 正确做法
memory_add "API Key 存储在环境变量 DASHSCOPE_API_KEY"  # 安全
```

### 记忆权限

| 记忆类型 | 访问权限 |
|---------|---------|
| P0 | 仅 shmily |
| P1 | 项目团队成员 |
| P2 | 所有 Agent |
| P3 | 公开 |

## 📊 最佳实践

### 1. 及时记录

```bash
# 完成重要任务后立即记录
memory_add "完成任务：实现 Anthropic Provider" 
           type="long_term" 
           priority="p1"
```

### 2. 使用标签

```bash
# 添加相关标签便于搜索
memory_add "..." tags=["agent", "model", "qwen3-coder-plus"]
```

### 3. 定期整理

```bash
# 每周整理记忆
memory_list(limit=100)
# 删除过期记忆
memory_delete "过时的内容"
```

### 4. 备份记忆

```bash
# 导出记忆备份
memory_export --output ~/.ergou/memory-backup.json

# 导入记忆
memory_import --input ~/.ergou/memory-backup.json
```

## 📞 故障排除

### 常见问题

**Q: 记忆搜索不到？**
A: 检查关键词是否准确，尝试使用同义词或扩大搜索范围

**Q: 记忆太多难以管理？**
A: 使用标签分类，定期整理和删除过期记忆

**Q: 如何共享记忆给其他 Agent？**
A: 使用 memory_export 导出，然后 memory_import 导入

---

_最后更新：2026-04-02_
_版本：1.0.0_
