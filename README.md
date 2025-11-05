# 本地选品管理工具

基于 Vue 3 + Node.js + SQLite 的本地选品管理工具，支持商品信息的增删改查操作。

## 功能特性

- ✅ 商品信息表单录入
- ✅ 表格展示所有商品数据
- ✅ 搜索、排序、分页功能
- ✅ 单条/批量编辑和删除
- ✅ 本地 SQLite 数据库存储
- ✅ 响应式界面设计

## 技术栈

### 前端
- Vue 3 + Vite
- Naive UI
- Axios

### 后端
- Node.js + Express
- SQLite3
- CORS

## 快速开始

### 安装依赖
```bash
npm run install-all
```

### 启动开发环境
```bash
npm run dev
```

前端访问：http://localhost:3000
后端API：http://localhost:3001

### 构建生产版本
```bash
npm run build
```

## 项目结构

```
├── backend/           # 后端服务
│   ├── server.js     # Express 服务器
│   ├── database.js   # 数据库配置
│   └── package.json
├── frontend/         # 前端应用
│   ├── src/
│   ├── public/
│   └── package.json
└── data.db          # SQLite 数据库文件
```

## API 接口

- GET /products - 获取所有商品
- POST /products - 新增商品
- PUT /products/:id - 修改商品
- DELETE /products/:id - 删除商品

## 数据库备份

数据库文件 `data.db` 位于项目根目录，可直接复制备份。