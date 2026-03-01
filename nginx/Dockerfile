# ============ 构建 web-client ============
FROM node:20-alpine AS build-web-client

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app
COPY web-client/package.json web-client/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY web-client/ .
RUN pnpm build

# ============ 构建 system-admin ============
FROM node:20-alpine AS build-system-admin

RUN apk add --no-cache git
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app
COPY system-admin/package.json system-admin/pnpm-lock.yaml system-admin/pnpm-workspace.yaml system-admin/.npmrc ./
COPY system-admin/packages/ ./packages/
RUN pnpm install --frozen-lockfile
COPY system-admin/ .
RUN pnpm build

# ============ 构建 merchant-admin ============
FROM node:20-alpine AS build-merchant-admin

RUN apk add --no-cache git
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app
COPY merchant-admin/package.json merchant-admin/pnpm-lock.yaml merchant-admin/pnpm-workspace.yaml merchant-admin/.npmrc ./
COPY merchant-admin/packages/ ./packages/
RUN pnpm install --frozen-lockfile
COPY merchant-admin/ .
RUN pnpm build

# ============ Nginx 最终镜像 ============
FROM nginx:alpine

# 复制 Nginx 配置
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# 复制各前端构建产物
COPY --from=build-web-client /app/dist /usr/share/nginx/html/web-client
COPY --from=build-system-admin /app/dist /usr/share/nginx/html/system-admin
COPY --from=build-merchant-admin /app/dist /usr/share/nginx/html/merchant-admin

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
