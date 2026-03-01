import { PrismaClient } from '../src/generated/prisma/client.js';
import { Role, OrderStatus } from '../src/generated/prisma/enums.js';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import * as bcrypt from 'bcrypt';

// 从环境变量解析数据库连接信息，支持 Docker 和本地开发
const dbUrl = process.env.DATABASE_URL || 'mysql://root:root@localhost:3307/canteen';
const url = new URL(dbUrl);

const adapter = new PrismaMariaDb({
  host: url.hostname,
  port: parseInt(url.port) || 3306,
  user: url.username,
  password: url.password,
  database: url.pathname.replace('/', ''),
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // hash 密码统一为 123456
  const password = await bcrypt.hash('123456', 10);

  console.log('开始初始化数据...');

  // ==================== 清空旧数据 ====================
  console.log('清空旧数据避免重复...');
  await prisma.complaint.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.order.deleteMany();
  await prisma.dish.deleteMany();
  await prisma.window.deleteMany();
  // 先把商户绑定的食堂/窗口解除，以免因为外键约束无法删除
  await prisma.user.updateMany({
    where: { role: Role.MERCHANT },
    data: { canteenId: null, windowId: null },
  });
  await prisma.canteen.deleteMany();

  // ==================== 1. 食堂 ====================
  const canteen1 = await prisma.canteen.create({
    data: { name: '第一食堂', building: '生活区A栋', floor: '1楼' },
  });
  const canteen2 = await prisma.canteen.create({
    data: { name: '第二食堂', building: '生活区B栋', floor: '1-2楼' },
  });
  const canteen3 = await prisma.canteen.create({
    data: { name: '教工食堂', building: '行政楼', floor: '1楼' },
  });
  console.log('✅ 食堂创建成功（3个）');

  // ==================== 2. 窗口 ====================
  // 第一食堂窗口
  const w1_1 = await prisma.window.create({
    data: { name: '黄焖鸡米饭', canteenId: canteen1.id },
  });
  const w1_2 = await prisma.window.create({
    data: { name: '兰州拉面', canteenId: canteen1.id },
  });
  const w1_3 = await prisma.window.create({
    data: { name: '麻辣香锅', canteenId: canteen1.id },
  });

  // 第二食堂窗口
  const w2_1 = await prisma.window.create({
    data: { name: '川菜馆', canteenId: canteen2.id },
  });
  const w2_2 = await prisma.window.create({
    data: { name: '东北饺子', canteenId: canteen2.id },
  });
  const w2_3 = await prisma.window.create({
    data: { name: '铁板烧', canteenId: canteen2.id },
  });

  // 教工食堂窗口
  const w3_1 = await prisma.window.create({
    data: { name: '精品套餐', canteenId: canteen3.id },
  });
  const w3_2 = await prisma.window.create({
    data: { name: '养生粥铺', canteenId: canteen3.id },
  });
  console.log('✅ 窗口创建成功（8个）');

  // ==================== 3. 用户 ====================
  // 管理员
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: { username: 'admin', password, role: Role.ADMIN },
  });
  console.log('✅ 管理员创建成功 (admin / 123456)');

  // 商户
  const merchant1 = await prisma.user.upsert({
    where: { username: 'merchant' },
    update: { canteenId: canteen1.id, windowId: w1_1.id },
    create: {
      username: 'merchant',
      password,
      role: Role.MERCHANT,
      canteenId: canteen1.id,
      windowId: w1_1.id,
    },
  });

  const merchant2 = await prisma.user.upsert({
    where: { username: 'merchant2' },
    update: { canteenId: canteen1.id, windowId: w1_2.id },
    create: {
      username: 'merchant2',
      password,
      role: Role.MERCHANT,
      canteenId: canteen1.id,
      windowId: w1_2.id,
    },
  });

  const merchant3 = await prisma.user.upsert({
    where: { username: 'merchant3' },
    update: { canteenId: canteen2.id, windowId: w2_1.id },
    create: {
      username: 'merchant3',
      password,
      role: Role.MERCHANT,
      canteenId: canteen2.id,
      windowId: w2_1.id,
    },
  });

  const merchant4 = await prisma.user.upsert({
    where: { username: 'merchant4' },
    update: { canteenId: canteen2.id, windowId: w2_2.id },
    create: {
      username: 'merchant4',
      password,
      role: Role.MERCHANT,
      canteenId: canteen2.id,
      windowId: w2_2.id,
    },
  });

  const merchant5 = await prisma.user.upsert({
    where: { username: 'merchant5' },
    update: { canteenId: canteen3.id, windowId: w3_1.id },
    create: {
      username: 'merchant5',
      password,
      role: Role.MERCHANT,
      canteenId: canteen3.id,
      windowId: w3_1.id,
    },
  });
  console.log('✅ 商户账号创建成功（5个，密码均为 123456）');

  // 学生
  const student1 = await prisma.user.upsert({
    where: { username: 'student' },
    update: {},
    create: { username: 'student', password, role: Role.STUDENT, balance: 100.0 },
  });
  const student2 = await prisma.user.upsert({
    where: { username: 'student2' },
    update: {},
    create: { username: 'student2', password, role: Role.STUDENT, balance: 50.0 },
  });
  const student3 = await prisma.user.upsert({
    where: { username: 'student3' },
    update: {},
    create: { username: 'student3', password, role: Role.STUDENT, balance: 200.0 },
  });
  const student4 = await prisma.user.upsert({
    where: { username: 'student4' },
    update: {},
    create: { username: 'student4', password, role: Role.STUDENT, balance: 0.0 },
  });
  console.log('✅ 学生账号创建成功（4个，密码均为 123456）');

  // ==================== 4. 菜品 ====================
  const dishesData = [
    // 第一食堂 - 黄焖鸡米饭
    { name: '大份黄焖鸡', price: 18.0, stock: 50, windowId: w1_1.id, isSpecial: true, imageUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&q=80' },
    { name: '小份黄焖鸡', price: 15.0, stock: 50, windowId: w1_1.id, imageUrl: 'https://images.unsplash.com/photo-1548943487-a2e4fe43f11e?w=500&q=80' },
    { name: '黄焖排骨', price: 20.0, stock: 30, windowId: w1_1.id, imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&q=80' },
    { name: '黄焖豆腐', price: 12.0, stock: 40, windowId: w1_1.id, isSpecial: true, imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80' },

    // 第一食堂 - 兰州拉面
    { name: '牛肉拉面', price: 12.0, stock: 100, windowId: w1_2.id, imageUrl: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=500&q=80' },
    { name: '羊肉烩面', price: 15.0, stock: 30, windowId: w1_2.id, imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&q=80' },
    { name: '炸酱面', price: 10.0, stock: 60, windowId: w1_2.id, imageUrl: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=500&q=80' },
    { name: '凉皮', price: 8.0, stock: 80, windowId: w1_2.id, isSpecial: true, imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&q=80' },

    // 第一食堂 - 麻辣香锅
    { name: '麻辣香锅（小份）', price: 22.0, stock: 40, windowId: w1_3.id, imageUrl: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=500&q=80' },
    { name: '麻辣香锅（大份）', price: 32.0, stock: 25, windowId: w1_3.id, imageUrl: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=500&q=80' },
    { name: '冒菜', price: 16.0, stock: 50, windowId: w1_3.id, imageUrl: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=500&q=80' },

    // 第二食堂 - 川菜馆
    { name: '宫保鸡丁饭', price: 16.0, stock: 60, windowId: w2_1.id, imageUrl: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=500&q=80' },
    { name: '麻婆豆腐饭', price: 14.0, stock: 50, windowId: w2_1.id, isSpecial: true, imageUrl: 'https://images.unsplash.com/photo-1582452919408-56ee53789964?w=500&q=80' },
    { name: '水煮肉片', price: 20.0, stock: 30, windowId: w2_1.id, imageUrl: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=500&q=80' },
    { name: '鱼香肉丝饭', price: 15.0, stock: 45, windowId: w2_1.id, imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80' },

    // 第二食堂 - 东北饺子
    { name: '猪肉白菜水饺', price: 12.0, stock: 100, windowId: w2_2.id, imageUrl: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=500&q=80' },
    { name: '三鲜蒸饺', price: 14.0, stock: 80, windowId: w2_2.id, imageUrl: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=500&q=80' },
    { name: '酸菜炖粉条', price: 18.0, stock: 40, windowId: w2_2.id, imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=500&q=80' },
    { name: '锅包肉', price: 22.0, stock: 35, windowId: w2_2.id, isSpecial: true, imageUrl: 'https://images.unsplash.com/photo-1562967916-eb82221dfb44?w=500&q=80' },

    // 第二食堂 - 铁板烧
    { name: '铁板牛肉', price: 25.0, stock: 30, windowId: w2_3.id, imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&q=80' },
    { name: '铁板鱿鱼', price: 18.0, stock: 40, windowId: w2_3.id, imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&q=80' },
    { name: '铁板炒饭', price: 14.0, stock: 60, windowId: w2_3.id, isOnSale: false, imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&q=80' },

    // 教工食堂 - 精品套餐
    { name: '红烧排骨套餐', price: 28.0, stock: 30, windowId: w3_1.id, imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&q=80' },
    { name: '清蒸鲈鱼套餐', price: 35.0, stock: 20, windowId: w3_1.id, isSpecial: true, imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&q=80' },
    { name: '番茄牛腩套餐', price: 30.0, stock: 25, windowId: w3_1.id, imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=500&q=80' },

    // 教工食堂 - 养生粥铺
    { name: '皮蛋瘦肉粥', price: 10.0, stock: 50, windowId: w3_2.id, imageUrl: 'https://images.unsplash.com/photo-1604152135912-04a022e23696?w=500&q=80' },
    { name: '八宝粥', price: 8.0, stock: 60, windowId: w3_2.id, imageUrl: 'https://images.unsplash.com/photo-1604152135912-04a022e23696?w=500&q=80' },
    { name: '小笼包', price: 12.0, stock: 80, windowId: w3_2.id, imageUrl: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=500&q=80' },
  ];

  await prisma.dish.createMany({ data: dishesData });
  console.log(`✅ 菜品创建成功（${dishesData.length}道）`);

  // ==================== 5. 订单 ====================
  // 获取所有菜品用于构建订单 items
  const allDishes = await prisma.dish.findMany();
  const dishMap = new Map(allDishes.map((d) => [d.name, d]));

  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

  const getDish = (name: string) => dishMap.get(name)!;

  // 辅助函数：构建订单 items
  const buildItems = (items: { name: string; quantity: number }[]) =>
    items.map((item) => {
      const dish = getDish(item.name);
      return {
        dishId: dish.id,
        name: dish.name,
        price: Number(dish.price),
        quantity: item.quantity,
      };
    });

  const calcTotal = (items: { name: string; quantity: number }[]) =>
    items.reduce((sum, item) => sum + Number(getDish(item.name).price) * item.quantity, 0);

  const ordersToCreate = [
    // 待处理订单
    {
      studentId: student1.id,
      windowId: w1_1.id,
      items: buildItems([{ name: '大份黄焖鸡', quantity: 1 }, { name: '黄焖豆腐', quantity: 1 }]),
      totalPrice: calcTotal([{ name: '大份黄焖鸡', quantity: 1 }, { name: '黄焖豆腐', quantity: 1 }]),
      status: OrderStatus.PENDING,
      remark: '少放辣',
      createdAt: new Date(now.getTime() - 5 * 60 * 1000),
    },
    {
      studentId: student2.id,
      windowId: w1_2.id,
      items: buildItems([{ name: '牛肉拉面', quantity: 2 }]),
      totalPrice: calcTotal([{ name: '牛肉拉面', quantity: 2 }]),
      status: OrderStatus.PENDING,
      createdAt: new Date(now.getTime() - 3 * 60 * 1000),
    },
    // 制作中
    {
      studentId: student3.id,
      windowId: w2_1.id,
      items: buildItems([{ name: '宫保鸡丁饭', quantity: 1 }, { name: '水煮肉片', quantity: 1 }]),
      totalPrice: calcTotal([{ name: '宫保鸡丁饭', quantity: 1 }, { name: '水煮肉片', quantity: 1 }]),
      status: OrderStatus.PREPARING,
      remark: '多加米饭',
      createdAt: new Date(now.getTime() - 15 * 60 * 1000),
    },
    // 待取餐
    {
      studentId: student1.id,
      windowId: w2_2.id,
      items: buildItems([{ name: '猪肉白菜水饺', quantity: 1 }, { name: '锅包肉', quantity: 1 }]),
      totalPrice: calcTotal([{ name: '猪肉白菜水饺', quantity: 1 }, { name: '锅包肉', quantity: 1 }]),
      status: OrderStatus.READY,
      pickupTime: new Date(now.getTime() + 10 * 60 * 1000),
      createdAt: new Date(now.getTime() - 25 * 60 * 1000),
    },
    // 已完成（今日）
    {
      studentId: student2.id,
      windowId: w1_1.id,
      items: buildItems([{ name: '小份黄焖鸡', quantity: 1 }]),
      totalPrice: calcTotal([{ name: '小份黄焖鸡', quantity: 1 }]),
      status: OrderStatus.COMPLETED,
      createdAt: twoHoursAgo,
    },
    {
      studentId: student3.id,
      windowId: w1_2.id,
      items: buildItems([{ name: '炸酱面', quantity: 1 }, { name: '凉皮', quantity: 1 }]),
      totalPrice: calcTotal([{ name: '炸酱面', quantity: 1 }, { name: '凉皮', quantity: 1 }]),
      status: OrderStatus.COMPLETED,
      createdAt: oneHourAgo,
    },
    // 已完成（昨日）
    {
      studentId: student1.id,
      windowId: w2_1.id,
      items: buildItems([{ name: '麻婆豆腐饭', quantity: 2 }]),
      totalPrice: calcTotal([{ name: '麻婆豆腐饭', quantity: 2 }]),
      status: OrderStatus.COMPLETED,
      createdAt: yesterday,
    },
    {
      studentId: student4.id,
      windowId: w1_3.id,
      items: buildItems([{ name: '麻辣香锅（大份）', quantity: 1 }]),
      totalPrice: calcTotal([{ name: '麻辣香锅（大份）', quantity: 1 }]),
      status: OrderStatus.COMPLETED,
      createdAt: yesterday,
    },
    // 已完成（前天）
    {
      studentId: student2.id,
      windowId: w2_3.id,
      items: buildItems([{ name: '铁板牛肉', quantity: 1 }, { name: '铁板鱿鱼', quantity: 1 }]),
      totalPrice: calcTotal([{ name: '铁板牛肉', quantity: 1 }, { name: '铁板鱿鱼', quantity: 1 }]),
      status: OrderStatus.COMPLETED,
      createdAt: twoDaysAgo,
    },
    // 已取消
    {
      studentId: student4.id,
      windowId: w1_2.id,
      items: buildItems([{ name: '羊肉烩面', quantity: 1 }]),
      totalPrice: calcTotal([{ name: '羊肉烩面', quantity: 1 }]),
      status: OrderStatus.CANCELLED,
      remark: '等太久了',
      createdAt: yesterday,
    },
  ];

  for (const order of ordersToCreate) {
    await prisma.order.create({ data: order });
  }
  console.log(`✅ 订单创建成功（${ordersToCreate.length}笔，覆盖所有状态）`);

  // ==================== 6. 投诉 ====================
  await prisma.complaint.createMany({
    data: [
      {
        studentId: student1.id,
        content: '第一食堂兰州拉面窗口的牛肉拉面牛肉量太少了，希望能改善一下。',
        status: 'PROCESSED',
        reply: '感谢您的反馈，我们已通知窗口负责人增加牛肉份量，请您再次品尝。',
      },
      {
        studentId: student2.id,
        content: '第二食堂中午排队时间太长，建议增加窗口或优化点餐流程。',
        status: 'PROCESSED',
        reply: '感谢建议！我们已在高峰时段增开临时窗口，并正在开发线上预约取餐功能。',
      },
      {
        studentId: student3.id,
        content: '麻辣香锅窗口今天的菜品不够新鲜，蔬菜有些发蔫。',
        status: 'PENDING',
      },
      {
        studentId: student4.id,
        content: '铁板烧窗口价格偏贵，希望能推出一些学生优惠套餐。',
        status: 'PENDING',
      },
      {
        studentId: student1.id,
        content: '教工食堂是否可以对学生开放？听说那里菜品质量很好。',
        status: 'PROCESSED',
        reply: '目前教工食堂暂不对学生开放，但我们会努力提升各食堂的菜品质量，感谢理解。',
      },
    ],
  });
  console.log('✅ 投诉创建成功（5条，含已处理和待处理）');

  // ==================== 7. 公告 ====================
  await prisma.announcement.createMany({
    data: [
      {
        title: '关于食堂春季菜单更新的通知',
        content:
          '各位同学：\n\n春季学期开始，各食堂将陆续更新菜单，新增多款时令菜品。第一食堂新增麻辣香锅窗口，第二食堂铁板烧窗口全面升级。欢迎大家前来品尝！\n\n后勤管理处\n2026年2月28日',
        authorId: admin.id,
      },
      {
        title: '食堂消费优惠活动',
        content:
          '即日起至3月底，凡在校园食堂单笔消费满30元，即可享受九折优惠。活动期间每日限量100份，先到先得！\n\n后勤管理处\n2026年2月25日',
        authorId: admin.id,
      },
      {
        title: '食堂卫生安全检查公告',
        content:
          '为保障广大师生饮食安全，后勤管理处于2月20日对全校各食堂进行了卫生安全检查。检查结果显示所有食堂均达标，食品留样、操作规范、环境卫生等各项指标良好。\n\n感谢大家的监督与支持！\n\n后勤管理处\n2026年2月22日',
        authorId: admin.id,
      },
      {
        title: '招募食堂志愿监督员',
        content:
          '为进一步提升食堂服务质量，现面向全校学生招募食堂志愿监督员10名。监督员将参与食堂卫生巡查、菜品质量评估和服务满意度调查。有意者请联系后勤管理处。\n\n后勤管理处\n2026年2月18日',
        authorId: admin.id,
      },
    ],
  });
  console.log('✅ 公告创建成功（4条）');

  // ==================== 完成 ====================
  console.log('\n========================================');
  console.log('所有种子数据初始化完成！');
  console.log('========================================');
  console.log('📋 数据概览：');
  console.log('  🏢 食堂 × 3（第一食堂、第二食堂、教工食堂）');
  console.log('  🪟 窗口 × 8');
  console.log(`  🍽️ 菜品 × ${dishesData.length}`);
  console.log('  👤 管理员 × 1 (admin / 123456)');
  console.log('  🏪 商户 × 5 (merchant ~ merchant5 / 123456)');
  console.log('  🎓 学生 × 4 (student ~ student4 / 123456)');
  console.log(`  📦 订单 × ${ordersToCreate.length}（覆盖全部5种状态）`);
  console.log('  📝 投诉 × 5');
  console.log('  📢 公告 × 4');
}

main()
  .catch((e) => {
    console.error('初始化数据失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
