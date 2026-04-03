#!/bin/bash

# 从 claude-code-sourcemap 复制核心代码到 ergou-cli

SOURCE="/Users/shmily/workspace/claude-code-sourcemap-main/restored-src/src"
TARGET="/Users/shmily/workspace/ergou-cli/src"

echo "🚀 开始复制核心代码..."

# 创建目录
mkdir -p $TARGET/tools
mkdir -p $TARGET/providers
mkdir -p $TARGET/agent
mkdir -p $TARGET/ui

# ========== 复制工具 ==========
echo "📦 复制工具代码..."

# BashTool - 核心工具
cp $SOURCE/tools/BashTool/BashTool.tsx $TARGET/tools/bash-tool.ts
cp $SOURCE/tools/BashTool/utils.ts $TARGET/tools/bash-utils.ts
cp $SOURCE/tools/BashTool/bashCommandHelpers.ts $TARGET/tools/bash-helpers.ts
cp $SOURCE/tools/BashTool/bashSecurity.ts $TARGET/tools/bash-security.ts
cp $SOURCE/tools/BashTool/pathValidation.ts $TARGET/tools/path-validation.ts

# FileReadTool
cp $SOURCE/tools/FileReadTool/FileReadTool.ts $TARGET/tools/file-read-tool.ts
cp $SOURCE/tools/FileReadTool/limits.ts $TARGET/tools/file-limits.ts

# FileWriteTool
cp $SOURCE/tools/FileWriteTool/*.ts $TARGET/tools/ 2>/dev/null || echo "FileWriteTool: 部分文件跳过"

# GrepTool
cp $SOURCE/tools/GrepTool/GrepTool.ts $TARGET/tools/grep-tool.ts

# GlobTool
cp $SOURCE/tools/GlobTool/*.ts $TARGET/tools/ 2>/dev/null || echo "GlobTool: 部分文件跳过"

# ========== 复制 Provider 相关 ==========
echo "📦 复制 Provider 相关代码..."

# 查找所有 provider 相关文件
find $SOURCE -name "*provider*" -o -name "*Provider*" -o -name "*anthropic*" -o -name "*claude*" 2>/dev/null | head -20

# ========== 复制 Agent 核心 ==========
echo "📦 复制 Agent 核心代码..."

cp $SOURCE/Task.ts $TARGET/agent/task.ts 2>/dev/null || echo "Task.ts: 跳过"
cp $SOURCE/Tool.ts $TARGET/agent/tool.ts 2>/dev/null || echo "Tool.ts: 跳过"
cp $SOURCE/cost-tracker.ts $TARGET/agent/cost-tracker.ts

# ========== 复制 CLI 相关 ==========
echo "📦 复制 CLI 相关代码..."

cp $SOURCE/cli/ndjsonSafeStringify.ts $TARGET/cli/ndjson.ts 2>/dev/null || echo "ndjson: 跳过"

# ========== 复制类型定义 ==========
echo "📦 复制类型定义..."

find $SOURCE -name "*.ts" -path "*/types/*" 2>/dev/null | head -10

echo "✅ 复制完成！"
echo ""
echo "📁 目标目录：$TARGET"
echo ""
echo "⚠️  注意：复制的代码可能需要调整以适应 ergou-cli 的架构"
