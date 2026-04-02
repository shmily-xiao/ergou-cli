# Agent 模型配置索引

## 📋 快速参考

### 代码编写 Agent
```bash
export ERGOU_CODER_MODEL=qwen3-coder-plus
```

### 配置文件
```json
{
  "agents": {
    "coder": {
      "model": "qwen3-coder-plus",
      "provider": "aliyun"
    }
  }
}
```

## 🔗 相关文档

- [Agent 模型详细配置](./AGENT_MODELS.md) - 完整的模型分配策略
- [阿里云 Provider](../src/providers/aliyun.ts) - 实现代码
- [使用指南](./USERGUIDE.md) - 如何使用不同 Agent

## 📊 模型对比

| 模型 | 适用场景 | 成本 | 上下文 |
|------|---------|------|--------|
| qwen3-coder-plus | 代码编写 ⭐ | $ | 256K |
| qwen3.5-plus | 通用对话 | $ | 256K |
| claude-opus-4-6 | 复杂推理 | $$$ | 200K |
| deepseek-chat | 快速响应 | $ | 128K |

---

_最后更新：2026-04-02_
