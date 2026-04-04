#!/bin/bash
# Ergou Code Startup Script
# API Provider: Aliyun (DashScope)
# Model: glm-5

export ERGOU_API_KEY="sk-f6e292159a814cd98ae67c0a57e3fadb"
export ANTHROPIC_BASE_URL="https://dashscope.aliyuncs.com/compatible-mode/v1"
export ANTHROPIC_MODEL="glm-5"

cd "$(dirname "$0")"
exec bun run ./src/bootstrap-entry.ts "$@"
