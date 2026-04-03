#!/bin/bash

# ergou-cli 完整功能测试脚本

set -e

echo "🧪 ergou-cli 完整功能测试"
echo "========================="
echo ""

cd /Users/shmily/workspace/ergou-cli

# 测试计数器
PASS=0
FAIL=0

# 测试函数
test_command() {
  local name="$1"
  local command="$2"
  
  echo -n "测试：$name ... "
  
  if eval "$command" > /tmp/test_output.txt 2>&1; then
    echo "✅ PASS"
    PASS=$((PASS + 1))
  else
    echo "❌ FAIL"
    FAIL=$((FAIL + 1))
    echo "  错误信息:"
    cat /tmp/test_output.txt | head -5
  fi
}

# 1. 构建测试
echo "📦 1. 构建测试"
test_command "构建项目" "bun run build"
echo ""

# 2. CLI 命令测试
echo "🔧 2. CLI 命令测试"
test_command "帮助命令" "bun run dev --help"
test_command "版本命令" "bun run dev version"
test_command "状态命令" "bun run dev status"
test_command "Provider 列表" "bun run dev providers"
test_command "配置列表" "bun run dev config -l"
echo ""

# 3. 模型列表测试
echo "📚 3. 模型列表测试"
test_command "阿里云模型列表" "DASHSCOPE_API_KEY=test-key bun run dev models -p aliyun"
echo ""

# 4. 工具系统测试
echo "🛠️  4. 工具系统测试"
test_command "工具注册表加载" "node -e \"import('./dist/index.js').then(m => console.log('Tools:', m.toolRegistry.list()))\""
echo ""

# 5. 配置文件测试
echo "⚙️  5. 配置文件测试"

# 创建测试配置
mkdir -p ~/.ergou
cat > ~/.ergou/test-config.json << 'EOF'
{
  "defaultProvider": "aliyun",
  "defaultModel": "qwen3.5-plus",
  "providers": {
    "aliyun": {
      "apiKey": "test-key-12345"
    }
  },
  "ui": {
    "theme": "dark",
    "showTokenUsage": true,
    "showCost": true
  }
}
EOF

test_command "配置文件创建" "test -f ~/.ergou/test-config.json"

# 清理测试配置
rm -f ~/.ergou/test-config.json
echo ""

# 6. 环境变量测试
echo "🌍 6. 环境变量测试"
test_command "环境变量加载" "DASHSCOPE_API_KEY=test-key bun run dev status"
echo ""

# 7. 文档检查
echo "📄 7. 文档检查"
test_command "README 存在" "test -f README.md"
test_command "P0 报告存在" "test -f P0_COMPLETE.md"
test_command "PROJECT_COMPLETE_REPORT 存在" "test -f PROJECT_COMPLETE_REPORT.md"
echo ""

# 8. Git 状态检查
echo "🔗 8. Git 状态检查"
test_command "Git 仓库" "git rev-parse --git-dir > /dev/null 2>&1"
test_command "Git 提交历史" "git log --oneline -1"
echo ""

# 总结
echo "========================="
echo "📊 测试结果总结"
echo "========================="
echo "✅ 通过：$PASS"
echo "❌ 失败：$FAIL"
echo "📈 通过率：$(( (PASS * 100) / (PASS + FAIL) ))%"
echo ""

if [ $FAIL -eq 0 ]; then
  echo "🎉 所有测试通过！"
  exit 0
else
  echo "⚠️  有 $FAIL 个测试失败，请检查"
  exit 1
fi
