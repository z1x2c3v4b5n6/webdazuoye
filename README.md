# 云计算/容器/K8s 学习路径平台

前端：React 18 + Vite + Ant Design + React Router v6 + Redux Toolkit + Axios  
后端：Node.js + Express（端口 3000）

## 快速开始

```bash
# 安装依赖（默认 npm，如使用 pnpm 也可）
npm run install-all

# 启动后端（http://localhost:3000）
npm run start-server

# 启动前端（http://localhost:5173）
npm run start-web

# 或一次性并行启动前后端
npm run dev
```

访问 http://localhost:5173 体验完整功能，前端将通过 Axios 访问 http://localhost:3000/api/* 接口。

## 目录结构
- frontend：Vite + React + Ant Design 前端工程
- server：Express 后端，提供课程所需 API
- REPORT.md：实验报告模板
- POSTER.md：设计说明海报文案
