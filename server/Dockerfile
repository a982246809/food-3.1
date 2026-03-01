# ============ 构建阶段 ============
FROM node:20-alpine AS builder

# 安装 pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# 先复制依赖文件，利用 Docker 缓存
COPY package.json pnpm-lock.yaml ./
COPY prisma.config.ts ./
COPY prisma/ ./prisma/

RUN pnpm install --frozen-lockfile

# 生成 Prisma Client
RUN npx prisma generate

# 复制全部源码并构建
COPY . .
RUN pnpm build

# ============ 运行阶段 ============
FROM node:20-alpine AS runner

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# 只复制生产所需文件
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./
COPY --from=builder /app/src/generated ./src/generated

# 复制启动脚本
COPY init.sh ./
RUN chmod +x init.sh

EXPOSE 3000

CMD ["./init.sh"]
