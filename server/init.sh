#!/bin/sh
set -e

echo "=== 等待数据库就绪 ==="
# 短暂等待以确保数据库连接池完成初始化
sleep 5

echo "=== 执行数据库迁移 ==="
npx prisma migrate deploy || echo "迁移跳过（可能是首次部署，使用 db push）"

echo "=== 同步数据库 Schema ==="
npx prisma db push --accept-data-loss || echo "数据库 Schema 已同步，跳过 db push 错误"

echo "=== 填充种子数据 ==="
npx tsx prisma/seed.ts || echo "种子数据已存在或填充失败，跳过"

echo "=== 启动应用 ==="
node dist/src/main.js
