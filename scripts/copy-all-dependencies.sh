#!/bin/bash

# 复制所有剩余依赖代码

set -e

SOURCE="/Users/shmily/workspace/claude-code-sourcemap-main/restored-src"
TARGET="/Users/shmily/workspace/ergou-cli/src"

echo "🚀 复制所有剩余依赖代码..."
echo ""

# ========== 复制 components (简化版) ==========
echo "📦 复制 components (创建占位文件)..."
mkdir -p $TARGET/components

# 创建常用组件的占位文件
cat > $TARGET/components/CtrlOToExpand.tsx << 'EOF'
// 占位组件
export function CtrlOToExpand() { return null; }
EOF

cat > $TARGET/components/FallbackToolUseErrorMessage.tsx << 'EOF'
// 占位组件
export function FallbackToolUseErrorMessage({ error }: { error?: string }) {
  return error || 'Unknown error';
}
EOF

cat > $TARGET/components/MessageResponse.tsx << 'EOF'
// 占位组件
export function MessageResponse() { return null; }
EOF

echo "✅ Components 占位文件创建完成"
echo ""

# ========== 复制更多 constants ==========
echo "📦 复制 constants..."

if [ -d "$SOURCE/src/constants" ]; then
  # 复制所有 constants 文件
  for const_file in $SOURCE/src/constants/*.ts; do
    const_name=$(basename "$const_file")
    echo "  复制 $const_name..."
    cp "$const_file" "$TARGET/constants/" 2>/dev/null || true
  done
  
  # 复制 constants 子目录
  for const_dir in $SOURCE/src/constants/*/; do
    dir_name=$(basename "$const_dir")
    echo "  复制 $dir_name..."
    cp -r "$const_dir" "$TARGET/constants/$dir_name" 2>/dev/null || true
  done
fi

echo "✅ Constants 复制完成"
echo ""

# ========== 复制 services ==========
echo "📦 复制 services..."

if [ -d "$SOURCE/src/services" ]; then
  # 复制所有 services
  for service_dir in $SOURCE/src/services/*/; do
    dir_name=$(basename "$service_dir")
    echo "  复制 $dir_name..."
    cp -r "$service_dir" "$TARGET/services/$dir_name" 2>/dev/null || true
  done
fi

echo "✅ Services 复制完成"
echo ""

# ========== 复制 hooks ==========
echo "📦 复制 hooks..."

if [ -d "$SOURCE/src/hooks" ]; then
  # 复制所有 hooks
  for hook_dir in $SOURCE/src/hooks/*/; do
    dir_name=$(basename "$hook_dir")
    echo "  复制 $dir_name..."
    cp -r "$hook_dir" "$TARGET/hooks/$dir_name" 2>/dev/null || true
  done
fi

echo "✅ Hooks 复制完成"
echo ""

# ========== 复制 context ==========
echo "📦 复制 context..."

if [ -d "$SOURCE/src/context" ]; then
  cp -r "$SOURCE/src/context" "$TARGET/"
  echo "✅ Context 复制完成"
fi

echo ""

# ========== 复制 state ==========
echo "📦 复制 state..."

if [ -d "$SOURCE/src/state" ]; then
  cp -r "$SOURCE/src/state" "$TARGET/"
  echo "✅ State 复制完成"
fi

echo ""

# ========== 复制 entrypoints ==========
echo "📦 复制 entrypoints..."

if [ -d "$SOURCE/src/entrypoints" ]; then
  cp -r "$SOURCE/src/entrypoints" "$TARGET/"
  echo "✅ Entrypoints 复制完成"
fi

echo ""

# ========== 复制 bootstrap ==========
echo "📦 复制 bootstrap..."

if [ -d "$SOURCE/src/bootstrap" ]; then
  cp -r "$SOURCE/src/bootstrap" "$TARGET/"
  echo "✅ Bootstrap 复制完成"
fi

echo ""

# ========== 复制 coordinator ==========
echo "📦 复制 coordinator..."

if [ -d "$SOURCE/src/coordinator" ]; then
  cp -r "$SOURCE/src/coordinator" "$TARGET/"
  echo "✅ Coordinator 复制完成"
fi

echo ""

# ========== 复制 assistant ==========
echo "📦 复制 assistant..."

if [ -d "$SOURCE/src/assistant" ]; then
  cp -r "$SOURCE/src/assistant" "$TARGET/"
  echo "✅ Assistant 复制完成"
fi

echo ""

# ========== 复制 buddy ==========
echo "📦 复制 buddy..."

if [ -d "$SOURCE/src/buddy" ]; then
  cp -r "$SOURCE/src/buddy" "$TARGET/"
  echo "✅ Buddy 复制完成"
fi

echo ""

# ========== 复制 keybindings ==========
echo "📦 复制 keybindings..."

if [ -d "$SOURCE/src/keybindings" ]; then
  cp -r "$SOURCE/src/keybindings" "$TARGET/"
  echo "✅ Keybindings 复制完成"
fi

echo ""

# ========== 复制 ink (核心) ==========
echo "📦 复制 ink..."

if [ -d "$SOURCE/src/ink" ]; then
  cp -r "$SOURCE/src/ink" "$TARGET/"
  echo "✅ Ink 复制完成"
fi

echo ""

# ========== 复制 main 相关文件 ==========
echo "📦 复制 main 相关文件..."

if [ -f "$SOURCE/src/main.tsx" ]; then
  cp "$SOURCE/src/main.tsx" "$TARGET/" 2>/dev/null || true
fi

if [ -f "$SOURCE/src/ink.ts" ]; then
  cp "$SOURCE/src/ink.ts" "$TARGET/" 2>/dev/null || true
fi

if [ -f "$SOURCE/src/commands.ts" ]; then
  cp "$SOURCE/src/commands.ts" "$TARGET/commands-full.ts" 2>/dev/null || true
fi

echo "✅ Main 文件复制完成"
echo ""

# ========== 复制 types (完整版) ==========
echo "📦 复制完整 types..."

if [ -d "$SOURCE/src/types" ]; then
  # 复制所有 types 文件
  for type_file in $SOURCE/src/types/*.ts; do
    type_name=$(basename "$type_file")
    echo "  复制 $type_name..."
    cp "$type_file" "$TARGET/types-full/$type_name" 2>/dev/null || true
  done
  
  # 复制 types 子目录
  for type_dir in $SOURCE/src/types/*/; do
    dir_name=$(basename "$type_dir")
    echo "  复制 $dir_name..."
    cp -r "$type_dir" "$TARGET/types-full/$dir_name" 2>/dev/null || true
  done
fi

echo "✅ Types 复制完成"
echo ""

# ========== 统计 ==========
echo "========================="
echo "📊 复制统计:"
echo "  Components: $(find $TARGET/components -name '*.tsx' -o -name '*.ts' | wc -l | tr -d ' ')"
echo "  Constants: $(find $TARGET/constants -name '*.ts' | wc -l | tr -d ' ')"
echo "  Services: $(find $TARGET/services -type d | wc -l | tr -d ' ')"
echo "  Hooks: $(find $TARGET/hooks -type d | wc -l | tr -d ' ')"
echo "  Context: $(find $TARGET/context -name '*.ts' | wc -l | tr -d ' ')"
echo "  Types: $(find $TARGET/types-full -name '*.ts' | wc -l | tr -d ' ')"
echo ""
echo "  总代码量：$(find $TARGET -name '*.ts' -o -name '*.tsx' | xargs wc -l 2>/dev/null | tail -1)"
echo ""
echo "✅ 所有代码复制完成！"
echo ""
