#!/bin/bash
# Ergou Code Startup Script
# API Provider: Aliyun (DashScope)
# Model: glm-5

# 设置环境变量 - 这些必须在程序启动前设置
export ERGOU_API_KEY="你的API密钥"
export ANTHROPIC_BASE_URL="https://dashscope.aliyuncs.com/compatible-mode/v1"
export ANTHROPIC_MODEL="glm-5"
export CLAUDE_CODE_COMPATIBLE_API_PROVIDER="openai"

# 调试输出（可选）
echo "🚀 Ergou Code 启动中..."
echo "   API: $ANTHROPIC_BASE_URL"
echo "   Model: $ANTHROPIC_MODEL"
echo "   Provider: openai (compat mode)"

cd "$(dirname "$0")"
exec bun run ./src/bootstrap-entry.ts "$@"
