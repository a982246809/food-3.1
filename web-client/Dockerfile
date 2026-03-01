# ============ 构建阶段 ============
FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# ============ 产出阶段 ============
FROM alpine:3.19 AS output
COPY --from=builder /app/dist /dist
