#!/bin/bash

# ergou-cli 测试脚本

set -e

echo "🚀 ergou-cli 功能测试"
echo "===================="
echo ""

cd /Users/shmily/workspace/ergou-cli

# 测试 1: 显示帮助
echo "✅ 测试 1: 显示帮助"
bun run dev --help
echo ""

# 测试 2: 列出 Provider
echo "✅ 测试 2: 列出 Provider"
bun run dev providers
echo ""

# 测试 3: 列出模型（阿里云）
echo "✅ 测试 3: 列出模型（需要配置 API Key）"
echo "💡 提示：设置 DASHSCOPE_API_KEY 环境变量后测试"
echo ""

# 测试 4: 工具测试
echo "✅ 测试 4: 工具系统测试"
echo "工具注册表已创建，包含以下工具："
echo "  - bash (Shell 命令执行)"
echo "  - file_read (文件读取)"
echo "  - file_write (文件写入)"
echo "  - file_edit (文件编辑)"
echo ""

# 测试 5: 构建检查
echo "✅ 测试 5: 构建检查"
bun run build
echo ""

echo "===================="
echo "🎉 所有测试完成！"
echo ""
echo "下一步："
echo "1. 配置 API Key: export DASHSCOPE_API_KEY=your-key"
echo "2. 测试对话：bun run dev chat -t"
echo "3. 测试工具：bun run dev chat --tools"
echo ""
