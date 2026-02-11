# 项目上下文 (GEMINI.md)

## 项目概览
本项目是一个全栈餐饮/食堂管理系统，包含 NestJS 后端、基于 Soybean Admin 的 Vue 3 管理后台，以及一个 Vue 3 Web 客户端。

## 目录结构与组件

### 1. 后端服务 (`/server`)
*   **框架:** NestJS (v11)
*   **语言:** TypeScript
*   **数据库 ORM:**  Prisma
*   **常用命令:**
    *   启动开发环境: `pnpm start:dev`
    *   构建: `pnpm build`
    *   测试: `pnpm test`

### 2. 管理后台 (`/soybean-admin`)
*   **框架:** Vue 3, Vite, TypeScript
*   **UI 组件库:** Naive UI, UnoCSS
*   **模板:** Soybean Admin (v2.0.2)
*   **常用命令:**
    *   启动开发环境: `pnpm dev` (默认为 test 模式)
    *   构建: `pnpm build`
    *   类型检查: `pnpm typecheck`

### 3. Web 客户端 (`/web-client`)
*   **框架:** Vue 3, Vite
*   **常用命令:**
    *   启动开发环境: `pnpm dev`
    *   构建: `pnpm build`

### 4. 基础设施
*   **数据库:** MySQL 8.0 (通过 Docker Compose 运行)
*   **Docker 配置:** `docker-compose.yml`
*   **连接信息:**
    *   端口: `3307` (映射自容器内 3306)
    *   用户名: `root`
    *   密码: `root`
    *   数据库名: `canteen`
    *   启动命令: `docker-compose up -d`

## 开发指南

### 环境准备
1.  **包管理器:** 本项目各模块均包含 `pnpm-lock.yaml`，建议统一使用 `pnpm`。
2.  **依赖安装:** 在各子目录下运行 `pnpm install` 安装依赖。
3.  **数据库:** 确保 Docker 运行中，执行 `docker-compose up -d` 启动数据库。

### 运行项目
建议在不同的终端窗口中分别启动服务：
*   **启动后端:** `cd server && pnpm start:dev`
*   **启动后台:** `cd soybean-admin && pnpm dev`
*   **启动客户端:** `cd web-client && pnpm dev`

## 变更管理 (OpenSpec)
*   本项目配置了 OpenSpec 工作流，位于 `.opencode` 和 `openspec` 目录。
*   相关技能配置位于 `.agent/skills`。

## 注意事项
*   **语言:** 请使用中文进行交互。
*   **代码规范:** 遵循各子项目现有的 ESLint 和 Prettier 配置。
