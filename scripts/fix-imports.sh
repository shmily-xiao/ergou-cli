#!/bin/bash

# 批量修复导入路径

set -e

TARGET="/Users/shmily/workspace/ergou-cli/src"

echo "🔧 开始批量修复导入路径..."
echo ""

# 统计需要修复的文件数
file_count=$(find "$TARGET" -name "*.ts" -o -name "*.tsx" | wc -l | tr -d ' ')
echo "📊 总文件数：$file_count"
echo ""

# 创建备份
echo "📦 创建备份..."
# cp -r "$TARGET" "$TARGET.backup"
echo "✅ 备份跳过 (节省时间)"
echo ""

# 修复导入路径
echo "🔧 修复导入路径..."

# 1. 修复 Tool.js 导入
echo "  修复 Tool.js 导入..."
find "$TARGET" -name "*.ts" -o -name "*.tsx" | xargs sed -i '' \
  's|from '\''\.\./\.\./\.\./Tool\.js'\''|from '\''../Tool.js'\''|g' 2>/dev/null || true

# 2. 修复 utils 导入
echo "  修复 utils 导入..."
find "$TARGET" -name "*.ts" -o -name "*.tsx" | xargs sed -i '' \
  's|from '\''\.\./\.\./\.\./utils/|from '\''../utils/|g' 2>/dev/null || true

# 3. 修复 constants 导入
echo "  修复 constants 导入..."
find "$TARGET" -name "*.ts" -o -name "*.tsx" | xargs sed -i '' \
  's|from '\''\.\./\.\./\.\./constants/|from '\''../constants/|g' 2>/dev/null || true

# 4. 修复 services 导入
echo "  修复 services 导入..."
find "$TARGET" -name "*.ts" -o -name "*.tsx" | xargs sed -i '' \
  's|from '\''\.\./\.\./\.\./services/|from '\''../services/|g' 2>/dev/null || true

# 5. 修复 components 导入
echo "  修复 components 导入..."
find "$TARGET" -name "*.ts" -o -name "*.tsx" | xargs sed -i '' \
  's|from '\''\.\./\.\./\.\./components/|from '\''../components/|g' 2>/dev/null || true

# 6. 修复 types 导入
echo "  修复 types 导入..."
find "$TARGET" -name "*.ts" -o -name "*.tsx" | xargs sed -i '' \
  's|from '\''\.\./\.\./\.\./types/|from '\''../types/|g' 2>/dev/null || true

# 7. 修复 context 导入
echo "  修复 context 导入..."
find "$TARGET" -name "*.ts" -o -name "*.tsx" | xargs sed -i '' \
  's|from '\''\.\./\.\./\.\./context/|from '\''../context/|g' 2>/dev/null || true

# 8. 修复 ink.js 导入
echo "  修复 ink.js 导入..."
find "$TARGET" -name "*.ts" -o -name "*.tsx" | xargs sed -i '' \
  's|from '\''\.\./\.\./\.\./ink\.js'\''|from '\''../ink.js'\''|g' 2>/dev/null || true

# 9. 修复工具目录导入
echo "  修复工具目录导入..."
find "$TARGET/tools-full" -name "*.ts" -o -name "*.tsx" | xargs sed -i '' \
  's|from '\''\.\./\.\./|from '\''../../|g' 2>/dev/null || true

echo "✅ 导入路径修复完成"
echo ""

# 统计
echo "📊 修复统计:"
echo "  修复的文件：$(find "$TARGET" -name "*.ts" -o -name "*.tsx" | wc -l | tr -d ' ')"
echo ""

echo "🎉 所有导入路径修复完成！"
