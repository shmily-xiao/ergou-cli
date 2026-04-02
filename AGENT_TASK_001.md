# Agent 任务委托 - 任务 001

## 🎯 任务
实现 Anthropic Provider

## 📋 详细要求

**执行 Agent**: ai-engineer  
**使用模型**: qwen3-coder-plus  
**优先级**: 🔴 P0

### 任务内容

请查看并执行：
`/Users/shmily/workspace/ergou-cli/tasks/001_IMPLEMENT_ANTHROPIC_PROVIDER.md`

### 参考文件
- `/Users/shmily/workspace/ergou-cli/src/providers/aliyun.ts` (参考实现)
- `/Users/shmily/workspace/ergou-cli/src/providers/base.ts` (基类)
- `/Users/shmily/workspace/ergou-cli/src/types/index.ts` (类型定义)

### 技术要求
1. 创建 `src/providers/anthropic.ts`
2. 继承 `BaseModelProvider`
3. 使用 `@anthropic-ai/sdk`
4. 支持 3 个 Claude 模型
5. 实现流式聊天
6. 添加成本计算
7. 注册到 ProviderRegistry

### 完成标准
- [ ] 代码实现完成
- [ ] 类型安全
- [ ] 测试通过
- [ ] Git 提交

## 🚀 执行方式

```bash
# ai-engineer 使用 qwen3-coder-plus 模型执行
/openclaw skill use agency-agents --agent ai-engineer "
执行任务 001: 实现 Anthropic Provider
参考：src/providers/aliyun.ts
创建：src/providers/anthropic.ts
要求：使用 @anthropic-ai/sdk，支持 3 个 Claude 模型
完成后提交 Git
"
```

---

_创建时间：2026-04-02 21:08_
_状态：🚀 准备执行_
