#!/bin/bash

# 获取脚本所在目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# 打开终端窗口显示进度
echo "🚀 启动本地选品管理工具..."

# 检查是否安装了依赖
if [ ! -d "node_modules" ] || [ ! -d "backend/node_modules" ] || [ ! -d "frontend/node_modules" ]; then
    echo "📦 检测到缺少依赖，正在安装..."
    npm run install-all
fi

echo "🔧 启动后端服务 (端口 3001)..."
echo "🎨 启动前端服务 (端口 3000)..."

# 保持终端窗口打开
npm run dev

echo "✅ 项目已启动！"
echo "🌐 前端访问: http://localhost:3000"
echo "🔗 后端API: http://localhost:3001"

# 等待用户按键后关闭窗口
read -p "按任意键关闭窗口..." -n1 -s