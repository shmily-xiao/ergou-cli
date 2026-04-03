#!/bin/bash

# 从 claude-code-sourcemap 复制完整工具代码到 ergou-cli

set -e

SOURCE="/Users/shmily/workspace/claude-code-sourcemap-main/restored-src"
TARGET="/Users/shmily/workspace/ergou-cli/src"

echo "🚀 开始复制完整工具代码..."
echo ""

# 创建目录
mkdir -p $TARGET/tools-full
mkdir -p $TARGET/utils
mkdir -p $TARGET/services

# ========== 复制所有工具 ==========
echo "📦 复制所有工具..."

# 复制所有工具文件夹
for tool_dir in $SOURCE/src/tools/*/; do
    tool_name=$(basename "$tool_dir")
    echo "  复制 $tool_name..."
    cp -r "$tool_dir" "$TARGET/tools-full/$tool_name" 2>/dev/null || true
done

# 复制工具相关文件
cp $SOURCE/src/tools/utils.ts $TARGET/tools-full/ 2>/dev/null || true

echo "✅ 工具复制完成"
echo ""

# ========== 复制依赖的 utils ==========
echo "📦 复制依赖的 utils..."

# 复制所有 utils 文件
for util_file in $SOURCE/src/utils/*.ts; do
    util_name=$(basename "$util_file")
    echo "  复制 $util_name..."
    cp "$util_file" "$TARGET/utils/" 2>/dev/null || true
done

# 复制 utils 子目录
for util_dir in $SOURCE/src/utils/*/; do
    dir_name=$(basename "$util_dir")
    echo "  复制 $dir_name..."
    cp -r "$util_dir" "$TARGET/utils/$dir_name" 2>/dev/null || true
done

echo "✅ Utils 复制完成"
echo ""

# ========== 复制 services ==========
echo "📦 复制 services..."

# 复制关键的 services
for service_dir in analytics services diagnosticTracking lsp mcp tokenEstimation; do
    if [ -d "$SOURCE/src/$service_dir" ]; then
        echo "  复制 $service_dir..."
        cp -r "$SOURCE/src/$service_dir" "$TARGET/services/" 2>/dev/null || true
    fi
done

echo "✅ Services 复制完成"
echo ""

# ========== 复制 constants ==========
echo "📦 复制 constants..."

if [ -d "$SOURCE/src/constants" ]; then
    cp -r "$SOURCE/src/constants" "$TARGET/" 
    echo "✅ Constants 复制完成"
fi

echo ""

# ========== 复制 memdir ==========
echo "📦 复制 memdir..."

if [ -d "$SOURCE/src/memdir" ]; then
    cp -r "$SOURCE/src/memdir" "$TARGET/"
    echo "✅ Memdir 复制完成"
fi

echo ""

# ========== 复制 skills ==========
echo "📦 复制 skills..."

if [ -d "$SOURCE/src/skills" ]; then
    cp -r "$SOURCE/src/skills" "$TARGET/"
    echo "✅ Skills 复制完成"
fi

echo ""

# ========== 复制 types ==========
echo "📦 复制 types..."

if [ -d "$SOURCE/src/types" ]; then
    cp -r "$SOURCE/src/types" "$TARGET/types-full"
    echo "✅ Types 复制完成"
fi

echo ""

# ========== 统计 ==========
echo "========================="
echo "📊 复制统计:"
echo "  工具目录：$(find $TARGET/tools-full -type d | wc -l | tr -d ' ')"
echo "  Utils 文件：$(find $TARGET/utils -name '*.ts' | wc -l | tr -d ' ')"
echo "  总代码量：$(find $TARGET/tools-full $TARGET/utils -name '*.ts' | xargs wc -l | tail -1)"
echo ""
echo "✅ 所有代码复制完成！"
echo ""
echo "⚠️  注意："
echo "  - 复制的代码可能需要调整导入路径"
echo "  - 某些依赖 React/Ink 的 UI 组件可能无法直接使用"
echo "  - 建议逐步整合，先测试核心功能"
echo ""
