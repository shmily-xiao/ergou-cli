#!/bin/bash

# Ergou CLI Agent 监控服务器启动脚本

echo "🎯 Ergou CLI Agent 监控大盘"
echo "=========================="
echo ""

# 检查端口
PORT=${1:-8090}

# 检查是否已有进程
if lsof -ti:$PORT; then
    echo "❌ 端口 $PORT 已被占用"
    echo "   使用：lsof -ti:$PORT | xargs kill 关闭"
    exit 1
fi

echo "📍 项目位置：$(pwd)"
echo "🌐 监控页面：http://localhost:$PORT/monitor.html"
echo "📊 数据文件：AGENT_STATUS.json"
echo "⏰ 刷新间隔：60 秒"
echo ""
echo "🚀 启动服务器..."
echo ""

# 启动 HTTP 服务器
if command -v python3 &> /dev/null; then
    echo "✅ 使用 Python3 HTTP 服务器"
    python3 -m http.server $PORT
elif command -v python &> /dev/null; then
    echo "✅ 使用 Python HTTP 服务器"
    python -m SimpleHTTPServer $PORT
elif command -v npx &> /dev/null; then
    echo "✅ 使用 http-server"
    npx http-server -p $PORT
else
    echo "❌ 未找到可用的 HTTP 服务器"
    echo ""
    echo "请安装以下任一工具："
    echo "  - Python3 (推荐): brew install python"
    echo "  - http-server: npm install -g http-server"
    exit 1
fi
