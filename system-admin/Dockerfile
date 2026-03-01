# ============ 构建阶段 ============
FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# 复制 monorepo 根文件
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# 复制 packages 目录（workspace 依赖）
COPY packages/ ./packages/

RUN pnpm install --frozen-lockfile

# 复制全部源码
COPY . .

# 以 prod 模式构建（VITE_SERVICE_BASE_URL=/api, VITE_BASE_URL=/admin/）
RUN pnpm build

# ============ 产出阶段 ============
FROM alpine:3.19 AS output
COPY --from=builder /app/dist /dist
