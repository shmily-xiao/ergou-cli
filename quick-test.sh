#!/bin/bash

# ergou-cli 快速测试脚本

set -e

echo "🚀 ergou-cli 快速测试"
echo "===================="
echo ""

cd /Users/shmily/workspace/ergou-cli

# 测试 1: 构建
echo "✅ 测试 1: 构建项目"
bun run build
echo ""

# 测试 2: 帮助
echo "✅ 测试 2: 显示帮助"
bun run dev --help | head -20
echo ""

# 测试 3: 状态
echo "✅ 测试 3: 系统状态"
bun run dev status
echo ""

# 测试 4: 配置
echo "✅ 测试 4: 配置列表"
bun run dev config -l
echo ""

# 测试 5: Provider
echo "✅ 测试 5: Provider 列表"
bun run dev providers
echo ""

echo "===================="
echo "🎉 所有测试完成！"
echo ""
echo "下一步:"
echo "1. 配置 API Key:"
echo "   export DASHSCOPE_API_KEY=your-key"
echo ""
echo "2. 测试对话:"
echo "   bun run dev chat"
echo ""
echo "3. 单条消息测试:"
echo "   bun run dev chat '你好'"
echo ""
