# 设计：基于 Vue 的校园食堂点餐系统

## 策略 (Strategy)
我们将采用前后端分离的架构。
- **前端**：一个双项目设置，包含：
  - `student-client`：使用 Vant UI 的移动端优先 Web 应用 (H5)。
  - `admin-dashboard`：商家和管理员桌面端 Web 应用。
- **后端**：提供 RESTful API 的 NestJS 单体应用。
- **数据库**：MySQL，包含用户、食堂、菜品、订单的关系表。

## 架构 (Architecture)

### 前端 (Vue 3)
- **状态管理**：使用 Pinia 管理全局用户状态、购物车和活跃订单跟踪。
- **路由**：使用 Vue Router，带有权限守卫（学生 vs 商家/管理员角色）。
- **网络**：封装 Axios，带有拦截器用于 JWT 注入和错误处理。

### 后端 (NestJS)
- **认证模块**：JWT 策略，区分 `Student`（学生）、`Merchant`（商家）、`Admin`（管理员）守卫。
- **食堂模块**：管理食堂、窗口和菜品实体。
- **订单模块**：处理订单创建、状态流转（状态机）和历史记录。

## 数据模型 (Data Model)

### 用户 (Users)
- `id`: UUID
- `username`: 字符串
- `role`: 枚举 (STUDENT, MERCHANT, ADMIN)
- `balance`: 小数
- `canteen_id`: UUID (可为空，用于商家)

### 菜品 (Dishes)
- `id`: UUID
- `window_id`: UUID
- `name`: 字符串
- `price`: 小数
- `stock`: 整数
- `is_special`: 布尔值

### 订单 (Orders)
- `id`: UUID
- `student_id`: UUID
- `window_id`: UUID
- `items`: JSON (菜品详情快照)
- `total_price`: 小数
- `status`: 枚举 (PENDING, PREPARING, READY, COMPLETED, CANCELLED)
- `pickup_time`: 时间戳

## 逻辑流程 (Logic Flow)
1.  **点餐**：
    -   学生添加商品 -> 购物车 (LocalStorage/Pinia) -> 结算。
    -   校验库存 -> 扣除余额 -> 创建订单 (PENDING)。
2.  **商家流程**：
    -   收到通知 -> 接单 (PREPARING) -> 打印小票。
    -   标记为待取餐 (READY) -> 通知学生。
    -   学生取餐 -> 完成 (COMPLETED)。
