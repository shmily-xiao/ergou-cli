# Agent 执行日志

## 📝 日志格式

```
[时间戳] [Agent 名称] [任务 ID] [状态] 消息
```

## 📊 当前日志

### agent-001-ai-engineer.log

```
[2026-04-02 21:10:00] [ai-engineer] [001] [INFO] 任务创建：实现 Anthropic Provider
[2026-04-02 21:10:00] [ai-engineer] [001] [INFO] 使用模型：qwen3-coder-plus
[2026-04-02 21:10:00] [ai-engineer] [001] [INFO] 参考文件：src/providers/aliyun.ts
[2026-04-02 21:10:00] [ai-engineer] [001] [START] 🟡 开始执行任务...
[2026-04-02 21:10:00] [ai-engineer] [001] [PROGRESS] 进度：0%
[2026-04-02 21:10:00] [ai-engineer] [001] [INFO] 等待执行...
```

### agent-status.log

```
[2026-04-02 21:10:00] [SYSTEM] [INFO] Agent 监控系统启动
[2026-04-02 21:10:00] [SYSTEM] [INFO] 活跃 Agent: 1/5
[2026-04-02 21:10:00] [SYSTEM] [INFO] 任务队列：1 个待执行
[2026-04-02 21:10:00] [SYSTEM] [INFO] 监控大盘：AGENT_MONITOR.md
```

## 🔍 查看日志

```bash
# 查看最新日志
tail -f logs/agent-001-ai-engineer.log

# 查看所有 Agent 状态
tail -f logs/agent-status.log

# 搜索特定任务
grep "001" logs/*.log
```

## 📈 日志级别

- **INFO** - 普通信息
- **START** - 任务开始
- **PROGRESS** - 进度更新
- **COMPLETE** - 任务完成
- **ERROR** - 错误信息
- **WARN** - 警告

---

_最后更新：2026-04-02 21:10_
