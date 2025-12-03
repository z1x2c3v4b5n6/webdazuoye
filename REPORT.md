# 课程报告模板

## 1. 目的
- 说明本项目旨在搭建“云计算/容器/K8s 学习路径”可运行平台，覆盖路线、专题、资源与个人看板。

## 2. 步骤
- 前端：React 18 + Vite + Ant Design 搭建多页面路由，使用 Redux Toolkit 管理收藏、进度、主题；Context 做全局通知。
- 后端：Express 提供 /api/paths、/api/tracks、/api/resources 等接口，读取本地 JSON 数据并支持分页、过滤。
- 交互：搜索筛选、分页、收藏、进度查看、最近浏览、暗色模式切换。

## 3. 结果
- 前后端可一键启动，访问 http://localhost:5173；前端数据均来自 http://localhost:3000/api/*。
- UI 使用 Ant Design 布局、卡片、列表、抽屉、标签、分页等组件，符合作业要求。

## 4. 技术点对照
- React Hooks：useState/useEffect/useMemo/useCallback 覆盖筛选、缓存、回调。
- 父子通信：FilterBar 通过 onChange 回调给 Tracks/Resources 页。
- 路由：React Router v6 配置 7 个页面 + 404。
- Ant Design：Layout、Menu、Breadcrumb、Card、List、Tag、Spin、Empty、Pagination、Drawer、Tabs、Modal(可按需扩展) 等组件。
- Redux Toolkit：favoritesSlice、progressSlice、uiSlice。
- Context：ThemeContext 提供主题与全局通知入口。
- 后端接口：Express + JSON 数据模拟真实 REST。
