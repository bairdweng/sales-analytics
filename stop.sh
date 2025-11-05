#!/bin/bash

# 获取脚本所在目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "🛑 停止本地选品管理工具..."

# 查找并杀死相关的Node.js进程
pkill -f "node.*server.js" 2>/dev/null && echo "✅ 后端服务已停止"
pkill -f "vite" 2>/dev/null && echo "✅ 前端服务已停止"

# 如果使用npm run dev启动的，也停止concurrently进程
pkill -f "concurrently" 2>/dev/null && echo "✅ 并发进程已停止"

# 检查是否还有相关进程在运行
if pgrep -f "node.*server.js" > /dev/null || pgrep -f "vite" > /dev/null; then
    echo "⚠️  仍有进程在运行，强制停止..."
    pkill -9 -f "node.*server.js" 2>/dev/null
    pkill -9 -f "vite" 2>/dev/null
    pkill -9 -f "concurrently" 2>/dev/null
fi

echo "✅ 所有服务已停止！"

# 等待用户按键后关闭窗口
read -p "按任意键关闭窗口..." -n1 -s