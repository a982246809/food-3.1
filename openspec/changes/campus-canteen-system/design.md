# 设计：校园食堂点餐系统

## 架构
- **前端**：Vue 3 (SPA)，使用 Composition API。
  - **学生端**：Vant UI。
  - **商家/后台**：Element Plus。
  - **网络**：Axios。
- **后端**：NestJS 框架。
  - **认证**：JWT。
  - **数据库**：MySQL。
  - **ORM**：**Prisma**（根据需求明确指定）。

## 数据库模式（Prisma Schema 概念）

### User
- `id`: Int/UUID
- `username`: String
- `password`: String
- `role`: Enum (STUDENT, MERCHANT, ADMIN)

### Dish
- `id`: Int
- `merchantId`: User.id
- `name`: String
- `price`: Decimal
- `description`: String
- `image`: String
- `stock`: Int (简单库存)

### Order
- `id`: Int
- `studentId`: User.id
- `merchantId`: User.id
- `status`: Enum (PENDING, PREPARING, COMPLETED, CANCELLED)
- `total`: Decimal
- `items`: OrderItem[]

## API 设计略
- 标准 RESTful API。
- **状态同步**: 客户端通过轮询 (Polling) 或用户手动下拉刷新来获取最新订单状态。

